import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all forms (admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.*, 
        COUNT(fs.id) as submission_count,
        COUNT(ff.id) as field_count
      FROM forms f
      LEFT JOIN form_submissions fs ON f.id = fs.form_id
      LEFT JOIN form_fields ff ON f.id = ff.form_id
      GROUP BY f.id
      ORDER BY f.created_at DESC
    `);
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch forms' });
  }
});

// Get form by ID with fields (admin)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM forms_with_fields WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Form not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch form' });
  }
});

// Get form by slug (public - for rendering forms)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await pool.query('SELECT * FROM forms_with_fields WHERE slug = $1 AND active = true', [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Form not found or inactive' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching form by slug:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch form' });
  }
});

// Create new form (admin)
router.post('/', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { name, slug, description, success_message, notification_email, fields = [] } = req.body;
    
    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({ success: false, error: 'Name and slug are required' });
    }
    
    // Check if slug already exists
    const existingForm = await client.query('SELECT id FROM forms WHERE slug = $1', [slug]);
    if (existingForm.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Form with this slug already exists' });
    }
    
    // Insert form
    const formResult = await client.query(`
      INSERT INTO forms (name, slug, description, success_message, notification_email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, slug, description, success_message, notification_email]);
    
    const formId = formResult.rows[0].id;
    
    // Insert fields if provided
    if (fields.length > 0) {
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        await client.query(`
          INSERT INTO form_fields (form_id, label, name, type, placeholder, required, field_order, options, validation_rules, default_value, help_text, max_length, min_length)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          formId,
          field.label,
          field.name,
          field.type,
          field.placeholder || null,
          field.required || false,
          field.field_order || i + 1,
          field.options ? JSON.stringify(field.options) : null,
          field.validation_rules ? JSON.stringify(field.validation_rules) : null,
          field.default_value || null,
          field.help_text || null,
          field.max_length || null,
          field.min_length || null
        ]);
      }
    }
    
    await client.query('COMMIT');
    
    // Fetch the complete form with fields
    const completeForm = await pool.query('SELECT * FROM forms_with_fields WHERE id = $1', [formId]);
    
    res.status(201).json({ success: true, data: completeForm.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating form:', error);
    res.status(500).json({ success: false, error: 'Failed to create form' });
  } finally {
    client.release();
  }
});

// Update form (admin)
router.put('/:id', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { name, slug, description, success_message, notification_email, active, fields = [] } = req.body;
    
    // Update form
    const formResult = await client.query(`
      UPDATE forms 
      SET name = $1, slug = $2, description = $3, success_message = $4, notification_email = $5, active = $6
      WHERE id = $7
      RETURNING *
    `, [name, slug, description, success_message, notification_email, active, id]);
    
    if (formResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Form not found' });
    }
    
    // Delete existing fields
    await client.query('DELETE FROM form_fields WHERE form_id = $1', [id]);
    
    // Insert updated fields
    if (fields.length > 0) {
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        await client.query(`
          INSERT INTO form_fields (form_id, label, name, type, placeholder, required, field_order, options, validation_rules, default_value, help_text, max_length, min_length)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          id,
          field.label,
          field.name,
          field.type,
          field.placeholder || null,
          field.required || false,
          field.field_order || i + 1,
          field.options ? JSON.stringify(field.options) : null,
          field.validation_rules ? JSON.stringify(field.validation_rules) : null,
          field.default_value || null,
          field.help_text || null,
          field.max_length || null,
          field.min_length || null
        ]);
      }
    }
    
    await client.query('COMMIT');
    
    // Fetch the complete updated form with fields
    const completeForm = await pool.query('SELECT * FROM forms_with_fields WHERE id = $1', [id]);
    
    res.json({ success: true, data: completeForm.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating form:', error);
    res.status(500).json({ success: false, error: 'Failed to update form' });
  } finally {
    client.release();
  }
});

// Delete form (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM forms WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Form not found' });
    }
    
    res.json({ success: true, message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ success: false, error: 'Failed to delete form' });
  }
});

// Submit form (public)
router.post('/slug/:slug/submit', async (req, res) => {
  try {
    const { slug } = req.params;
    const formData = req.body;
    
    // Get form configuration
    const formResult = await pool.query('SELECT * FROM forms_with_fields WHERE slug = $1 AND active = true', [slug]);
    
    if (formResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Form not found or inactive' });
    }
    
    const form = formResult.rows[0];
    const fields = form.fields || [];
    
    // Validate required fields
    const errors = [];
    const validatedData = {};
    
    for (const field of fields) {
      const value = formData[field.name];
      
      // Check required fields
      if (field.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field.label} is required`);
        continue;
      }
      
      // Skip validation if field is empty and not required
      if (!value || value.toString().trim() === '') {
        continue;
      }
      
      // Validate field types and rules
      const validation = field.validation_rules || {};
      
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`${field.label} must be a valid email address`);
        }
      }
      
      if (field.type === 'tel' && validation.pattern) {
        const phoneRegex = new RegExp(validation.pattern);
        if (!phoneRegex.test(value)) {
          errors.push(`${field.label} must be a valid phone number`);
        }
      }
      
      if (validation.minLength && value.length < validation.minLength) {
        errors.push(`${field.label} must be at least ${validation.minLength} characters`);
      }
      
      if (validation.maxLength && value.length > validation.maxLength) {
        errors.push(`${field.label} must be no more than ${validation.maxLength} characters`);
      }
      
      // For select/radio fields, validate that value is in options
      if ((field.type === 'select' || field.type === 'radio') && field.options) {
        const validOptions = field.options.map(opt => opt.value) || [];
        if (!validOptions.includes(value)) {
          errors.push(`${field.label} contains invalid option`);
        }
      }
      
      validatedData[field.name] = value;
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    
    // Store submission
    const submissionResult = await pool.query(`
      INSERT INTO form_submissions (form_id, data, ip_address, user_agent)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [
      form.id,
      JSON.stringify(validatedData),
      req.ip || req.connection.remoteAddress,
      req.get('User-Agent')
    ]);
    
    res.status(201).json({ 
      success: true, 
      message: form.success_message || 'Thank you for your submission!',
      submissionId: submissionResult.rows[0].id 
    });
    
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ success: false, error: 'Failed to submit form' });
  }
});

// Get form submissions (admin)
router.get('/:id/submissions', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50, status } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT fs.*, f.name as form_name, f.slug
      FROM form_submissions fs
      JOIN forms f ON fs.form_id = f.id
      WHERE fs.form_id = $1
    `;
    const params = [id];
    
    if (status) {
      query += ` AND fs.status = $${params.length + 1}`;
      params.push(status);
    }
    
    query += ` ORDER BY fs.submitted_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM form_submissions WHERE form_id = $1';
    const countParams = [id];
    
    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    
    res.json({ 
      success: true, 
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch submissions' });
  }
});

// Update submission status (admin)
router.patch('/submissions/:submissionId/status', authenticateToken, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status } = req.body;
    
    if (!['new', 'read', 'processed', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    
    const result = await pool.query(`
      UPDATE form_submissions 
      SET status = $1 
      WHERE id = $2 
      RETURNING *
    `, [status, submissionId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({ success: false, error: 'Failed to update submission status' });
  }
});

export default router;