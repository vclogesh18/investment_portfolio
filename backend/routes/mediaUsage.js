import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/media-usage/:mediaId - Get usage information for a specific media item
router.get('/:mediaId', authenticateToken, async (req, res) => {
  try {
    const { mediaId } = req.params;
    
    const usageQueries = [
      // Team members using this image
      {
        query: `SELECT id, name, title, 'team_member' as type, 'Team Member' as type_label 
                FROM team_members WHERE image_id = $1`,
        values: [mediaId]
      },
      // Pages using this as hero background
      {
        query: `SELECT id, title, slug, 'page_hero' as type, 'Page Hero Background' as type_label 
                FROM pages WHERE hero_background_image = $1`,
        values: [mediaId.toString()]
      },
      // Pages using this as og image
      {
        query: `SELECT id, title, slug, 'page_og' as type, 'Page OG Image' as type_label 
                FROM pages WHERE og_image = $1`,
        values: [mediaId.toString()]
      },
      // Page content using this as background
      {
        query: `SELECT pc.id, pc.section_title as title, p.title as page_title, 
                       'page_content' as type, 'Page Content Background' as type_label 
                FROM page_content pc 
                JOIN pages p ON pc.page_id = p.id 
                WHERE pc.background_image_url = $1`,
        values: [mediaId.toString()]
      }
    ];

    const results = await Promise.all(
      usageQueries.map(({ query, values }) => pool.query(query, values))
    );

    const usage = results.flatMap(result => result.rows);

    res.json({
      success: true,
      mediaId: parseInt(mediaId),
      usage,
      usageCount: usage.length
    });

  } catch (error) {
    console.error('Error fetching media usage:', error);
    res.status(500).json({ error: 'Failed to fetch media usage' });
  }
});

// GET /api/media-usage - Get usage summary for all media
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get all media with usage counts
    const mediaQuery = `
      SELECT m.*, 
             (SELECT COUNT(*) FROM team_members WHERE image_id = m.id) as team_usage,
             (SELECT COUNT(*) FROM pages WHERE hero_background_image = CAST(m.id AS VARCHAR) OR og_image = CAST(m.id AS VARCHAR)) as page_usage,
             (SELECT COUNT(*) FROM page_content WHERE background_image_url = CAST(m.id AS VARCHAR)) as content_usage
      FROM media m
      ORDER BY m.created_at DESC
    `;

    const result = await pool.query(mediaQuery);
    
    const mediaWithUsage = result.rows.map(item => ({
      ...item,
      total_usage: parseInt(item.team_usage) + parseInt(item.page_usage) + parseInt(item.content_usage),
      usage_breakdown: {
        team_members: parseInt(item.team_usage),
        pages: parseInt(item.page_usage),
        page_content: parseInt(item.content_usage)
      }
    }));

    res.json({
      success: true,
      media: mediaWithUsage
    });

  } catch (error) {
    console.error('Error fetching media usage summary:', error);
    res.status(500).json({ error: 'Failed to fetch media usage summary' });
  }
});

// POST /api/media-usage/assign - Assign media to records
router.post('/assign', authenticateToken, async (req, res) => {
  try {
    const { mediaId, recordType, recordId, fieldName } = req.body;

    let updateQuery;
    let values;

    switch (recordType) {
      case 'team_member':
        updateQuery = 'UPDATE team_members SET image_id = $1 WHERE id = $2';
        values = [mediaId, recordId];
        break;
      case 'page_hero':
        updateQuery = 'UPDATE pages SET hero_background_image = $1 WHERE id = $2';
        values = [mediaId, recordId];
        break;
      case 'page_og':
        updateQuery = 'UPDATE pages SET og_image = $1 WHERE id = $2';
        values = [mediaId, recordId];
        break;
      case 'page_content':
        updateQuery = 'UPDATE page_content SET background_image_url = $1 WHERE id = $2';
        values = [mediaId, recordId];
        break;
      default:
        return res.status(400).json({ error: 'Invalid record type' });
    }

    await pool.query(updateQuery, values);

    res.json({
      success: true,
      message: 'Media assigned successfully'
    });

  } catch (error) {
    console.error('Error assigning media:', error);
    res.status(500).json({ error: 'Failed to assign media' });
  }
});

// DELETE /api/media-usage/unassign - Remove media assignment
router.delete('/unassign', authenticateToken, async (req, res) => {
  try {
    const { recordType, recordId } = req.body;

    let updateQuery;
    let values;

    switch (recordType) {
      case 'team_member':
        updateQuery = 'UPDATE team_members SET image_id = NULL WHERE id = $1';
        values = [recordId];
        break;
      case 'page_hero':
        updateQuery = 'UPDATE pages SET hero_background_image = NULL WHERE id = $1';
        values = [recordId];
        break;
      case 'page_og':
        updateQuery = 'UPDATE pages SET og_image = NULL WHERE id = $1';
        values = [recordId];
        break;
      case 'page_content':
        updateQuery = 'UPDATE page_content SET background_image_url = NULL WHERE id = $1';
        values = [recordId];
        break;
      default:
        return res.status(400).json({ error: 'Invalid record type' });
    }

    await pool.query(updateQuery, values);

    res.json({
      success: true,
      message: 'Media unassigned successfully'
    });

  } catch (error) {
    console.error('Error unassigning media:', error);
    res.status(500).json({ error: 'Failed to unassign media' });
  }
});

export default router;