import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ES module setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/media/public - Get all media files (public access)
router.get('/public', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM media';
    let countQuery = 'SELECT COUNT(*) FROM media';
    const values = [];

    if (category) {
      query += ' WHERE category = $1';
      countQuery += ' WHERE category = $1';
      values.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
    values.push(limit, offset);

    const [mediaResult, countResult] = await Promise.all([
      pool.query(query, values),
      pool.query(countQuery, category ? [category] : [])
    ]);

    const media = mediaResult.rows.map(item => ({
      ...item,
      url: item.file_path // Use the correct file_path without adding /uploads/
    }));

    res.json({
      media,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// GET /api/media - Get all media files (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM media';
    let countQuery = 'SELECT COUNT(*) FROM media';
    const values = [];

    if (category) {
      query += ' WHERE category = $1';
      countQuery += ' WHERE category = $1';
      values.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
    values.push(limit, offset);

    const [mediaResult, countResult] = await Promise.all([
      pool.query(query, values),
      pool.query(countQuery, category ? [category] : [])
    ]);

    const media = mediaResult.rows.map(item => ({
      ...item,
      url: item.file_path // Use the correct file_path without adding /uploads/
    }));

    res.json({
      media,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// POST /api/media/upload - Upload new media file
router.post('/upload', authenticateToken, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { alt_text, category } = req.body;

    const query = `
      INSERT INTO media (
        filename, original_name, file_path, file_size, mime_type, alt_text, category
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      req.file.filename,
      req.file.originalname,
      req.file.filename,
      req.file.size,
      req.file.mimetype,
      alt_text,
      category
    ];

    const result = await pool.query(query, values);
    
    const mediaItem = {
      ...result.rows[0],
      url: `/uploads/${result.rows[0].file_path}`
    };

    res.status(201).json({
      success: true,
      media: mediaItem
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

// PUT /api/media/:id - Update media metadata
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { alt_text, category } = req.body;

    const query = `
      UPDATE media 
      SET 
        alt_text = COALESCE($1, alt_text),
        category = COALESCE($2, category),
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await pool.query(query, [alt_text, category, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Media not found' });
    }

    const mediaItem = {
      ...result.rows[0],
      url: `/uploads/${result.rows[0].file_path}`
    };

    res.json({
      success: true,
      media: mediaItem
    });
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({ error: 'Failed to update media' });
  }
});

// DELETE /api/media/:id - Delete media file
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM media WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Media not found' });
    }

    const media = result.rows[0];

    // Delete file from filesystem
    const filePath = path.join(uploadsDir, media.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await pool.query('DELETE FROM media WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

export default router;