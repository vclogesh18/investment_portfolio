import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/investments - Get all investment areas (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] API call to /api/investments from ${req.ip}`);
    
    const { category, includeInactive } = req.query; // 'pillar' or 'sector'
    
    let query = `
      SELECT * FROM investment_areas 
    `;
    const values = [];
    const conditions = [];

    // Only filter by active status if not admin requesting all
    if (!includeInactive || includeInactive !== 'true') {
      conditions.push('is_active = true');
    }

    if (category) {
      conditions.push(`category = $${values.length + 1}`);
      values.push(category);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY position, id';
    
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching investment areas:', error);
    res.status(500).json({ error: 'Failed to fetch investment areas' });
  }
});

// POST /api/investments - Create new investment area (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      icon,
      category,
      position = 0
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const query = `
      INSERT INTO investment_areas (
        title, description, icon, category, position
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [title, description, icon, category, position];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      investment: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating investment area:', error);
    res.status(500).json({ error: 'Failed to create investment area' });
  }
});

// PUT /api/investments/:id - Update investment area (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      icon,
      category,
      position,
      is_active
    } = req.body;

    const query = `
      UPDATE investment_areas 
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        icon = COALESCE($3, icon),
        category = COALESCE($4, category),
        position = COALESCE($5, position),
        is_active = COALESCE($6, is_active),
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;

    const values = [title, description, icon, category, position, is_active, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Investment area not found' });
    }

    res.json({
      success: true,
      investment: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating investment area:', error);
    res.status(500).json({ error: 'Failed to update investment area' });
  }
});

// DELETE /api/investments/:id - Delete investment area (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM investment_areas WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Investment area not found' });
    }

    res.json({
      success: true,
      message: 'Investment area deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting investment area:', error);
    res.status(500).json({ error: 'Failed to delete investment area' });
  }
});

export default router;