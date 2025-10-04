import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/pages - Get all pages (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id, p.slug, p.title, p.meta_description, p.meta_title,
        p.status, p.page_type, p.created_at, p.updated_at,
        COUNT(pc.id) as content_sections_count
      FROM pages p
      LEFT JOIN page_content pc ON p.slug = pc.page_slug
      WHERE p.status = 'published'
      GROUP BY p.id
      ORDER BY p.page_type, p.title
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// GET /api/pages/:slug - Get page by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(`[${new Date().toISOString()}] API call to /api/pages/${slug} from ${req.ip}`);
    
    const pageQuery = `
      SELECT * FROM pages 
      WHERE slug = $1 AND status = 'published'
    `;
    
    const pageResult = await pool.query(pageQuery, [slug]);
    
    if (pageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const page = pageResult.rows[0];

    // Get page content sections
    const contentQuery = `
      SELECT * FROM page_content 
      WHERE page_slug = $1 AND is_active = true
      ORDER BY position, id
    `;
    
    const contentResult = await pool.query(contentQuery, [slug]);

    // Get office locations if it's contact page
    let officeLocations = [];
    if (slug === 'contact') {
      const officesResult = await pool.query(`
        SELECT * FROM office_locations 
        WHERE is_active = true
        ORDER BY position, id
      `);
      officeLocations = officesResult.rows;
    }

    // Get hero sections (if any) - These tables don't exist yet, so skip for now
    // const heroResult = await pool.query(`
    //   SELECT * FROM hero_sections 
    //   WHERE page_slug = $1 AND is_active = true
    //   ORDER BY position, id
    //   LIMIT 1
    // `, [slug]);

    // Get quotes (if any) - These tables don't exist yet, so skip for now
    // const quotesResult = await pool.query(`
    //   SELECT * FROM quotes 
    //   WHERE page_slug = $1 AND is_active = true
    //   ORDER BY section_position, id
    // `, [slug]);

    // Get CTA sections (if any) - These tables don't exist yet, so skip for now
    // const ctaResult = await pool.query(`
    //   SELECT * FROM cta_sections 
    //   WHERE page_slug = $1 AND is_active = true
    //   ORDER BY position, id
    // `, [slug]);

    const pageData = {
      page,
      content: contentResult.rows,
      officeLocations,
      hero: null, // Will be populated when hero_sections table is created
      quotes: [], // Will be populated when quotes table is created
      cta: [] // Will be populated when cta_sections table is created
    };

    res.json(pageData);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// Admin-only routes for managing pages
// GET /api/pages/admin/all - Get all pages with admin info
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
             COUNT(pc.id) as content_sections_count
      FROM pages p
      LEFT JOIN page_content pc ON p.slug = pc.page_slug
      GROUP BY p.id
      ORDER BY p.title
    `);

    res.json({
      success: true,
      pages: result.rows
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// POST /api/pages - Create new page (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      slug,
      title,
      meta_description,
      meta_title,
      meta_keywords,
      og_image,
      canonical_url,
      page_type,
      status = 'published'
    } = req.body;

    if (!slug || !title || !page_type) {
      return res.status(400).json({ error: 'Slug, title, and page_type are required' });
    }

    const query = `
      INSERT INTO pages (
        slug, title, meta_description, meta_title, meta_keywords,
        og_image, canonical_url, page_type, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      slug, title, meta_description, meta_title, meta_keywords,
      og_image, canonical_url, page_type, status
    ];
    
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      page: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating page:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Page slug already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create page' });
    }
  }
});

// PUT /api/pages/:slug - Update page metadata (admin)
router.put('/:slug', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      title,
      meta_description,
      meta_title,
      meta_keywords,
      og_image,
      canonical_url,
      status
    } = req.body;

    const query = `
      UPDATE pages SET
        title = $1, meta_description = $2, meta_title = $3,
        meta_keywords = $4, og_image = $5, canonical_url = $6,
        status = $7, updated_at = NOW()
      WHERE slug = $8
      RETURNING *
    `;

    const values = [
      title, meta_description, meta_title, meta_keywords,
      og_image, canonical_url, status || 'published', slug
    ];
    
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({
      success: true,
      page: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// POST /api/pages/:slug/content - Create page content section (admin)
router.post('/:slug/content', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      content_type,
      section_name,
      title,
      subtitle,
      description,
      content,
      background_image_url,
      background_color,
      text_color,
      layout_type,
      position
    } = req.body;

    const query = `
      INSERT INTO page_content (
        page_slug, content_type, section_name, title, subtitle,
        description, content, background_image_url, background_color,
        text_color, layout_type, position
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      slug, content_type, section_name, title, subtitle,
      description, content, background_image_url, background_color,
      text_color, layout_type, position || 0
    ];
    
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      content: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating page content:', error);
    res.status(500).json({ error: 'Failed to create page content' });
  }
});

// PUT /api/pages/:slug/content/:id - Update page content section (admin)
router.put('/:slug/content/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { slug, id } = req.params;
    const {
      content_type,
      section_name,
      title,
      subtitle,
      description,
      content,
      background_image_url,
      background_color,
      text_color,
      layout_type,
      position,
      is_active
    } = req.body;

    const query = `
      UPDATE page_content SET
        content_type = $1, section_name = $2, title = $3, subtitle = $4,
        description = $5, content = $6, background_image_url = $7,
        background_color = $8, text_color = $9, layout_type = $10,
        position = $11, is_active = $12, updated_at = NOW()
      WHERE id = $13 AND page_slug = $14
      RETURNING *
    `;

    const values = [
      content_type, section_name, title, subtitle, description, content,
      background_image_url, background_color, text_color, layout_type,
      position, is_active, id, slug
    ];
    
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content section not found' });
    }

    res.json({
      success: true,
      content: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating page content:', error);
    res.status(500).json({ error: 'Failed to update page content' });
  }
});

// DELETE /api/pages/:slug/content/:id - Delete page content section (admin)
router.delete('/:slug/content/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { slug, id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM page_content WHERE id = $1 AND page_slug = $2 RETURNING *',
      [id, slug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content section not found' });
    }

    res.json({ success: true, message: 'Content section deleted successfully' });
  } catch (error) {
    console.error('Error deleting page content:', error);
    res.status(500).json({ error: 'Failed to delete content section' });
  }
});

export default router;