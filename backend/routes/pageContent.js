import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/content/:slug - Get all content for a page (public)
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(`[${new Date().toISOString()}] API call to /api/content/${slug} from ${req.ip}`);
    
    // Get page metadata
    const pageQuery = `
      SELECT * FROM pages 
      WHERE slug = $1 AND status = 'published'
    `;
    const pageResult = await pool.query(pageQuery, [slug]);
    
    if (pageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const page = pageResult.rows[0];

    // Get all content sections for this page
    const contentQuery = `
      SELECT * FROM page_content 
      WHERE page_slug = $1 AND is_active = true
      ORDER BY position, id
    `;
    const contentResult = await pool.query(contentQuery, [slug]);

    // Structure the response by content type
    const response = {
      page: page,
      hero: null,
      sections: [],
      features: [],
      contact_info: [],
      form_config: []
    };

    // Group content by type
    contentResult.rows.forEach(content => {
      switch (content.content_type) {
        case 'hero':
          response.hero = {
            title: content.title,
            subtitle: content.subtitle,
            description: content.description,
            background_image_url: content.background_image_url,
            background_color: content.background_color,
            text_color: content.text_color,
            ...content.content // Merge any additional JSON content
          };
          break;
        case 'text_section':
          response.sections.push({
            id: content.id,
            type: content.content_type,
            section_name: content.section_name,
            title: content.title,
            subtitle: content.subtitle,
            description: content.description,
            layout_type: content.layout_type,
            position: content.position,
            ...content.content
          });
          break;
        case 'feature_list':
          response.features.push({
            id: content.id,
            type: content.content_type,
            section_name: content.section_name,
            title: content.title,
            description: content.description,
            layout_type: content.layout_type,
            items: content.content || [],
            position: content.position
          });
          break;
        case 'contact_info':
          response.contact_info.push({
            id: content.id,
            type: content.content_type,
            section_name: content.section_name,
            title: content.title,
            description: content.description,
            data: content.content,
            position: content.position
          });
          break;
        case 'form_config':
          response.form_config.push({
            id: content.id,
            type: content.content_type,
            section_name: content.section_name,
            title: content.title,
            config: content.content,
            position: content.position
          });
          break;
        default:
          // Handle other content types generically
          response.sections.push({
            id: content.id,
            type: content.content_type,
            section_name: content.section_name,
            title: content.title,
            subtitle: content.subtitle,
            description: content.description,
            content: content.content,
            layout_type: content.layout_type,
            position: content.position
          });
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

// PUT /api/content/:slug/hero - Update hero section (admin only)
router.put('/:slug/hero', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      title,
      subtitle,
      description,
      background_image_url,
      background_color,
      text_color,
      ...additionalContent
    } = req.body;

    // Check if hero section exists
    const existingQuery = `
      SELECT id FROM page_content 
      WHERE page_slug = $1 AND content_type = 'hero'
    `;
    const existingResult = await pool.query(existingQuery, [slug]);

    let query, values;
    
    if (existingResult.rows.length > 0) {
      // Update existing hero
      query = `
        UPDATE page_content SET
          title = $2,
          subtitle = $3,
          description = $4,
          background_image_url = $5,
          background_color = $6,
          text_color = $7,
          content = $8,
          updated_at = NOW()
        WHERE page_slug = $1 AND content_type = 'hero'
        RETURNING *
      `;
      values = [slug, title, subtitle, description, background_image_url, 
                background_color, text_color, JSON.stringify(additionalContent)];
    } else {
      // Create new hero
      query = `
        INSERT INTO page_content (
          page_slug, content_type, section_name, title, subtitle, description,
          background_image_url, background_color, text_color, content, position
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      values = [slug, 'hero', 'hero', title, subtitle, description,
                background_image_url, background_color, text_color, 
                JSON.stringify(additionalContent), 0];
    }

    const result = await pool.query(query, values);
    
    res.json({
      success: true,
      hero: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({ error: 'Failed to update hero section' });
  }
});

// POST /api/content/:slug/sections - Add new content section (admin only)
router.post('/:slug/sections', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      content_type,
      section_name,
      title,
      subtitle,
      description,
      content,
      layout_type,
      background_image_url,
      position
    } = req.body;

    const query = `
      INSERT INTO page_content (
        page_slug, content_type, section_name, title, subtitle, description,
        content, layout_type, background_image_url, position
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [slug, content_type, section_name, title, subtitle, description,
                   JSON.stringify(content), layout_type, background_image_url, position || 0];
    
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      section: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating content section:', error);
    res.status(500).json({ error: 'Failed to create content section' });
  }
});

// PUT /api/content/:slug/sections/:id - Update content section (admin only)
router.put('/:slug/sections/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { slug, id } = req.params;
    const {
      title,
      subtitle,
      description,
      content,
      layout_type,
      background_image_url,
      position,
      is_active
    } = req.body;

    const query = `
      UPDATE page_content SET
        title = $3,
        subtitle = $4,
        description = $5,
        content = $6,
        layout_type = $7,
        background_image_url = $8,
        position = $9,
        is_active = $10,
        updated_at = NOW()
      WHERE page_slug = $1 AND id = $2
      RETURNING *
    `;

    const values = [slug, id, title, subtitle, description,
                   JSON.stringify(content), layout_type, background_image_url, 
                   position, is_active !== undefined ? is_active : true];
    
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content section not found' });
    }

    res.json({
      success: true,
      section: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating content section:', error);
    res.status(500).json({ error: 'Failed to update content section' });
  }
});

// DELETE /api/content/:slug/sections/:id - Delete content section (admin only)
router.delete('/:slug/sections/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { slug, id } = req.params;

    const query = `
      DELETE FROM page_content 
      WHERE page_slug = $1 AND id = $2
      RETURNING id
    `;

    const result = await pool.query(query, [slug, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content section not found' });
    }

    res.json({
      success: true,
      message: 'Content section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting content section:', error);
    res.status(500).json({ error: 'Failed to delete content section' });
  }
});

// PUT /api/content/:slug/reorder - Reorder content sections (admin only)
router.put('/:slug/reorder', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    const { sections } = req.body; // Array of {id, position}

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      for (const section of sections) {
        await client.query(
          'UPDATE page_content SET position = $1 WHERE page_slug = $2 AND id = $3',
          [section.position, slug, section.id]
        );
      }

      await client.query('COMMIT');
      
      res.json({
        success: true,
        message: 'Content sections reordered successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error reordering content sections:', error);
    res.status(500).json({ error: 'Failed to reorder content sections' });
  }
});

export default router;