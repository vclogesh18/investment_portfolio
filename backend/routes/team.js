import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/team - Get all team members (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const query = `
      SELECT 
        tm.*,
        m.file_path as image_url,
        m.alt_text as image_alt
      FROM team_members tm
      LEFT JOIN media m ON tm.image_id = m.id
      WHERE tm.is_active = true
      ORDER BY tm.position, tm.id
    `;
    
    const result = await pool.query(query);
    
    // Transform data to match frontend expectations
    const teamMembers = result.rows.map(member => ({
      id: member.id,
      name: member.name,
      title: member.title,
      experience: member.experience,
      education: member.education,
      linkedin_url: member.linkedin_url,
      emailID: member.email, // Keep original naming for compatibility
      image_id: member.image_id, // Include image_id for the admin panel
      image: member.image_url, // Use the correct file_path without adding /uploads/
      image_alt: member.image_alt,
      position: member.position
    }));

    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// GET /api/team/:id - Get single team member (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        tm.*,
        m.file_path as image_url,
        m.alt_text as image_alt
      FROM team_members tm
      LEFT JOIN media m ON tm.image_id = m.id
      WHERE tm.id = $1 AND tm.is_active = true
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    const member = result.rows[0];
    const teamMember = {
      id: member.id,
      name: member.name,
      title: member.title,
      experience: member.experience,
      education: member.education,
      linkedin_url: member.linkedin_url,
      emailID: member.email,
      image_id: member.image_id, // Include image_id for the admin panel
      image: member.image_url, // Use the correct file_path without adding /uploads/
      image_alt: member.image_alt,
      position: member.position
    };

    res.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
});

// POST /api/team - Create new team member (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      title,
      experience,
      education,
      linkedin_url,
      email,
      image_id,
      position = 0
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const query = `
      INSERT INTO team_members (
        name, title, experience, education, linkedin_url, email, image_id, position
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [name, title, experience, education, linkedin_url, email, image_id, position];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      member: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// PUT /api/team/:id - Update team member (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      title,
      experience,
      education,
      linkedin_url,
      email,
      image_id,
      position,
      is_active
    } = req.body;

    const query = `
      UPDATE team_members 
      SET 
        name = COALESCE($1, name),
        title = COALESCE($2, title),
        experience = COALESCE($3, experience),
        education = COALESCE($4, education),
        linkedin_url = COALESCE($5, linkedin_url),
        email = COALESCE($6, email),
        image_id = COALESCE($7, image_id),
        position = COALESCE($8, position),
        is_active = COALESCE($9, is_active),
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `;

    const values = [name, title, experience, education, linkedin_url, email, image_id, position, is_active, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({
      success: true,
      member: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// DELETE /api/team/:id - Delete team member (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM team_members WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

export default router;