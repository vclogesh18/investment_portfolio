import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/offices - Get all office locations (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const query = `
      SELECT * FROM office_locations 
      WHERE is_active = true
      ORDER BY position, id
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching offices:', error);
    res.status(500).json({ error: 'Failed to fetch offices' });
  }
});

// POST /api/offices - Create new office (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      logo,
      sector,
      position = 0
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Office name is required' });
    }

    const query = `
      INSERT INTO office_locations (
        name, address, phone, email, logo, sector, position
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [name, address, phone, email, logo, sector, position];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      office: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating office:', error);
    res.status(500).json({ error: 'Failed to create office' });
  }
});

// PUT /api/offices/:id - Update office (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      phone,
      email,
      logo,
      sector,
      position,
      is_active
    } = req.body;

    const query = `
      UPDATE office_locations 
      SET 
        name = COALESCE($1, name),
        address = COALESCE($2, address),
        phone = COALESCE($3, phone),
        email = COALESCE($4, email),
        logo = COALESCE($5, logo),
        sector = COALESCE($6, sector),
        position = COALESCE($7, position),
        is_active = COALESCE($8, is_active),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;

    const values = [name, address, phone, email, logo, sector, position, is_active, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Office not found' });
    }

    res.json({
      success: true,
      office: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating office:', error);
    res.status(500).json({ error: 'Failed to update office' });
  }
});

// DELETE /api/offices/:id - Delete office (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM office_locations WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Office not found' });
    }

    res.json({
      success: true,
      message: 'Office deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting office:', error);
    res.status(500).json({ error: 'Failed to delete office' });
  }
});

export default router;