import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/portfolio - Get all portfolio companies (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const query = `
      SELECT 
        pc.*,
        m.file_path as logo_url,
        m.alt_text as logo_alt
      FROM portfolio_companies pc
      LEFT JOIN media m ON pc.logo_id = m.id
      WHERE pc.is_active = true
      ORDER BY pc.position, pc.id
    `;
    
    const result = await pool.query(query);
    
    const companies = result.rows.map(company => ({
      id: company.id,
      name: company.name,
      description: company.description,
      website: company.website,
      sector: company.sector,
      logo_id: company.logo_id, // Include logo_id for the admin panel
      logo: company.logo_url, // Use the correct file_path without adding /uploads/
      logo_alt: company.logo_alt,
      position: company.position
    }));

    res.json(companies);
  } catch (error) {
    console.error('Error fetching portfolio companies:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio companies' });
  }
});

// GET /api/portfolio/:id - Get single company (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        pc.*,
        m.file_path as logo_url,
        m.alt_text as logo_alt
      FROM portfolio_companies pc
      LEFT JOIN media m ON pc.logo_id = m.id
      WHERE pc.id = $1 AND pc.is_active = true
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const company = result.rows[0];
    const portfolioCompany = {
      id: company.id,
      name: company.name,
      description: company.description,
      website: company.website,
      sector: company.sector,
      logo_id: company.logo_id, // Include logo_id for the admin panel
      logo: company.logo_url, // Use the correct file_path without adding /uploads/
      logo_alt: company.logo_alt,
      position: company.position
    };

    res.json(portfolioCompany);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// POST /api/portfolio - Create new company (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      website,
      sector,
      logo_id,
      position = 0
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    const query = `
      INSERT INTO portfolio_companies (
        name, description, website, sector, logo_id, position
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [name, description, website, sector, logo_id, position];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      company: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// PUT /api/portfolio/:id - Update company (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      website,
      sector,
      logo_id,
      position,
      is_active
    } = req.body;

    const query = `
      UPDATE portfolio_companies 
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        website = COALESCE($3, website),
        sector = COALESCE($4, sector),
        logo_id = COALESCE($5, logo_id),
        position = COALESCE($6, position),
        is_active = COALESCE($7, is_active),
        updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `;

    const values = [name, description, website, sector, logo_id, position, is_active, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      success: true,
      company: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// DELETE /api/portfolio/:id - Delete company (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM portfolio_companies WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

export default router;