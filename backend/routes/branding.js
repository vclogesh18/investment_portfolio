import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/branding - Get all branding settings (public endpoint)
router.get('/', async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] API call to /api/branding from ${req.ip}`);
    
    const result = await pool.query(`
      SELECT 
        bs.setting_key,
        bs.setting_value,
        bs.media_id,
        bs.description,
        m.filename as media_filename,
        m.file_path as media_path,
        m.alt_text as media_alt
      FROM branding_settings bs
      LEFT JOIN media m ON bs.media_id = m.id
      WHERE bs.is_active = true
      ORDER BY bs.setting_key
    `);

    // Convert to key-value object for easier frontend consumption
    const brandingData = {};
    result.rows.forEach(row => {
      brandingData[row.setting_key] = {
        value: row.setting_value,
        media_id: row.media_id,
        media_path: row.media_path,
        media_alt: row.media_alt,
        description: row.description
      };
    });

    res.json(brandingData);
  } catch (error) {
    console.error('Error fetching branding settings:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// GET /api/branding/footer-links - Get footer links (public endpoint)
router.get('/footer-links', async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] API call to /api/branding/footer-links from ${req.ip}`);
    
    const result = await pool.query(`
      SELECT id, label, url, is_external, position, is_active
      FROM footer_links
      WHERE is_active = true
      ORDER BY position ASC, label ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching footer links:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/branding/:key - Update a branding setting (admin only)
router.put('/:key', authenticateToken, async (req, res) => {
  try {
    const { key } = req.params;
    const { setting_value, media_id } = req.body;

    console.log(`[${new Date().toISOString()}] Updating branding setting: ${key}`);

    const result = await pool.query(`
      UPDATE branding_settings 
      SET setting_value = $1, media_id = $2, updated_at = NOW()
      WHERE setting_key = $3 AND is_active = true
      RETURNING *
    `, [setting_value, media_id || null, key]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branding setting not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating branding setting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/branding/footer-links - Create footer link (admin only)
router.post('/footer-links', authenticateToken, async (req, res) => {
  try {
    const { label, url, is_external = false, position = 0 } = req.body;

    if (!label || !url) {
      return res.status(400).json({ error: 'Label and URL are required' });
    }

    console.log(`[${new Date().toISOString()}] Creating footer link: ${label}`);

    const result = await pool.query(`
      INSERT INTO footer_links (label, url, is_external, position)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [label, url, is_external, position]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating footer link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/branding/footer-links/:id - Update footer link (admin only)
router.put('/footer-links/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { label, url, is_external, position, is_active } = req.body;

    console.log(`[${new Date().toISOString()}] Updating footer link: ${id}`);

    const result = await pool.query(`
      UPDATE footer_links 
      SET 
        label = COALESCE($1, label),
        url = COALESCE($2, url),
        is_external = COALESCE($3, is_external),
        position = COALESCE($4, position),
        is_active = COALESCE($5, is_active),
        updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [label, url, is_external, position, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Footer link not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating footer link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/branding/footer-links/:id - Delete footer link (admin only)
router.delete('/footer-links/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`[${new Date().toISOString()}] Deleting footer link: ${id}`);

    const result = await pool.query(`
      UPDATE footer_links 
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Footer link not found' });
    }

    res.json({ message: 'Footer link deleted successfully' });
  } catch (error) {
    console.error('Error deleting footer link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;