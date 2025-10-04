import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET /api/homepage - Get homepage content including investment pillars
router.get('/', async (req, res) => {
  try {
    // Get page content
    const pageQuery = `
      SELECT * FROM page_content 
      WHERE page_slug = 'homepage' 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const pageResult = await pool.query(pageQuery);
    
    // Get investment areas (pillars and sectors)
    const investmentQuery = `
      SELECT * FROM investment_areas 
      WHERE is_active = true 
      ORDER BY position ASC, created_at ASC
    `;
    const investmentResult = await pool.query(investmentQuery);
    
    // Separate pillars and sectors
    const pillars = investmentResult.rows.filter(item => item.category === 'pillar');
    const sectors = investmentResult.rows.filter(item => item.category === 'sector');
    
    const response = {
      page: pageResult.rows[0] || {
        hero_title: 'Seven Boson Group',
        hero_description: 'Leading Private Equity and Investment Management',
        hero_background_image: null
      },
      pillars,
      sectors,
      investment_areas: investmentResult.rows
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    res.status(500).json({ error: 'Failed to fetch homepage content' });
  }
});

export default router;