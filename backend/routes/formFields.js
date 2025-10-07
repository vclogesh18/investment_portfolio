import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all fields for a specific form
router.get('/form/:formId', authenticateToken, async (req, res) => {
  try {
    const { formId } = req.params;
    
    const result = await pool.query(`
      SELECT * FROM form_fields 
      WHERE form_id = $1 
      ORDER BY field_order ASC
    `, [formId]);
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching form fields:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch form fields' });
  }
});

// Create new field
router.post('/form/:formId', authenticateToken, async (req, res) => {
  try {
    const { formId } = req.params;
    const {
      label,
      name,
      type,
      placeholder,
      required = false,
      field_order,
      options,
      validation_rules,
      default_value,
      help_text,
      max_length,
      min_length
    } = req.body;
    
    // Validate required fields
    if (!label || !name || !type) {
      return res.status(400).json({ 
        success: false, 
        error: 'Label, name, and type are required' 
      });
    }
    
    // Validate field type
    const validTypes = ['text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio', 'file', 'tel', 'url', 'date'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid field type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    // Check if field name already exists in this form
    const existingField = await pool.query(
      'SELECT id FROM form_fields WHERE form_id = $1 AND name = $2',
      [formId, name]
    );
    
    if (existingField.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Field with this name already exists in the form' 
      });
    }
    
    // If no field_order provided, set it as the last field
    let finalFieldOrder = field_order;
    if (!finalFieldOrder) {
      const maxOrderResult = await pool.query(
        'SELECT COALESCE(MAX(field_order), 0) + 1 as next_order FROM form_fields WHERE form_id = $1',
        [formId]
      );
      finalFieldOrder = maxOrderResult.rows[0].next_order;
    }
    
    const result = await pool.query(`
      INSERT INTO form_fields (
        form_id, label, name, type, placeholder, required, field_order, 
        options, validation_rules, default_value, help_text, max_length, min_length
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      formId, label, name, type, placeholder, required, finalFieldOrder,
      options ? JSON.stringify(options) : null,
      validation_rules ? JSON.stringify(validation_rules) : null,
      default_value, help_text, max_length, min_length
    ]);
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating form field:', error);
    res.status(500).json({ success: false, error: 'Failed to create form field' });
  }
});

// Update field
router.put('/:fieldId', authenticateToken, async (req, res) => {
  try {
    const { fieldId } = req.params;
    const {
      label,
      name,
      type,
      placeholder,
      required,
      field_order,
      options,
      validation_rules,
      default_value,
      help_text,
      max_length,
      min_length
    } = req.body;
    
    // Check if field exists
    const existingField = await pool.query('SELECT form_id FROM form_fields WHERE id = $1', [fieldId]);
    if (existingField.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Field not found' });
    }
    
    // If updating name, check for duplicates in the same form
    if (name) {
      const duplicateCheck = await pool.query(
        'SELECT id FROM form_fields WHERE form_id = $1 AND name = $2 AND id != $3',
        [existingField.rows[0].form_id, name, fieldId]
      );
      
      if (duplicateCheck.rows.length > 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Field with this name already exists in the form' 
        });
      }
    }
    
    const result = await pool.query(`
      UPDATE form_fields SET
        label = COALESCE($1, label),
        name = COALESCE($2, name),
        type = COALESCE($3, type),
        placeholder = COALESCE($4, placeholder),
        required = COALESCE($5, required),
        field_order = COALESCE($6, field_order),
        options = COALESCE($7, options),
        validation_rules = COALESCE($8, validation_rules),
        default_value = COALESCE($9, default_value),
        help_text = COALESCE($10, help_text),
        max_length = COALESCE($11, max_length),
        min_length = COALESCE($12, min_length),
        updated_at = NOW()
      WHERE id = $13
      RETURNING *
    `, [
      label, name, type, placeholder, required, field_order,
      options ? JSON.stringify(options) : null,
      validation_rules ? JSON.stringify(validation_rules) : null,
      default_value, help_text, max_length, min_length, fieldId
    ]);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating form field:', error);
    res.status(500).json({ success: false, error: 'Failed to update form field' });
  }
});

// Delete field
router.delete('/:fieldId', authenticateToken, async (req, res) => {
  try {
    const { fieldId } = req.params;
    
    const result = await pool.query('DELETE FROM form_fields WHERE id = $1 RETURNING *', [fieldId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Field not found' });
    }
    
    res.json({ success: true, message: 'Field deleted successfully' });
  } catch (error) {
    console.error('Error deleting form field:', error);
    res.status(500).json({ success: false, error: 'Failed to delete form field' });
  }
});

// Reorder fields
router.patch('/form/:formId/reorder', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { formId } = req.params;
    const { fieldIds } = req.body; // Array of field IDs in new order
    
    if (!Array.isArray(fieldIds)) {
      return res.status(400).json({ 
        success: false, 
        error: 'fieldIds must be an array' 
      });
    }
    
    // Verify all fields belong to this form
    const fieldCheck = await client.query(
      'SELECT id FROM form_fields WHERE form_id = $1 AND id = ANY($2)',
      [formId, fieldIds]
    );
    
    if (fieldCheck.rows.length !== fieldIds.length) {
      return res.status(400).json({ 
        success: false, 
        error: 'Some field IDs do not belong to this form' 
      });
    }
    
    // Update field orders
    for (let i = 0; i < fieldIds.length; i++) {
      await client.query(
        'UPDATE form_fields SET field_order = $1 WHERE id = $2',
        [i + 1, fieldIds[i]]
      );
    }
    
    await client.query('COMMIT');
    
    // Return updated fields
    const updatedFields = await pool.query(`
      SELECT * FROM form_fields 
      WHERE form_id = $1 
      ORDER BY field_order ASC
    `, [formId]);
    
    res.json({ success: true, data: updatedFields.rows });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error reordering fields:', error);
    res.status(500).json({ success: false, error: 'Failed to reorder fields' });
  } finally {
    client.release();
  }
});

// Duplicate field
router.post('/:fieldId/duplicate', authenticateToken, async (req, res) => {
  try {
    const { fieldId } = req.params;
    
    // Get the original field
    const originalField = await pool.query('SELECT * FROM form_fields WHERE id = $1', [fieldId]);
    
    if (originalField.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Field not found' });
    }
    
    const field = originalField.rows[0];
    
    // Generate unique name
    const baseName = field.name;
    let newName = `${baseName}_copy`;
    let counter = 1;
    
    while (true) {
      const nameCheck = await pool.query(
        'SELECT id FROM form_fields WHERE form_id = $1 AND name = $2',
        [field.form_id, newName]
      );
      
      if (nameCheck.rows.length === 0) break;
      
      counter++;
      newName = `${baseName}_copy_${counter}`;
    }
    
    // Get next order position
    const maxOrderResult = await pool.query(
      'SELECT COALESCE(MAX(field_order), 0) + 1 as next_order FROM form_fields WHERE form_id = $1',
      [field.form_id]
    );
    
    const nextOrder = maxOrderResult.rows[0].next_order;
    
    // Create duplicate
    const result = await pool.query(`
      INSERT INTO form_fields (
        form_id, label, name, type, placeholder, required, field_order,
        options, validation_rules, default_value, help_text, max_length, min_length
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      field.form_id,
      `${field.label} (Copy)`,
      newName,
      field.type,
      field.placeholder,
      field.required,
      nextOrder,
      field.options,
      field.validation_rules,
      field.default_value,
      field.help_text,
      field.max_length,
      field.min_length
    ]);
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error duplicating field:', error);
    res.status(500).json({ success: false, error: 'Failed to duplicate field' });
  }
});

// Get field types and their configurations
router.get('/field-types', async (req, res) => {
  try {
    const fieldTypes = {
      text: {
        label: 'Text Input',
        description: 'Single line text input',
        supports: ['placeholder', 'required', 'default_value', 'help_text', 'max_length', 'min_length'],
        validation_options: ['minLength', 'maxLength', 'pattern']
      },
      email: {
        label: 'Email Address',
        description: 'Email input with validation',
        supports: ['placeholder', 'required', 'default_value', 'help_text'],
        validation_options: ['pattern']
      },
      number: {
        label: 'Number',
        description: 'Numeric input',
        supports: ['placeholder', 'required', 'default_value', 'help_text'],
        validation_options: ['min', 'max', 'step']
      },
      tel: {
        label: 'Phone Number',
        description: 'Telephone number input',
        supports: ['placeholder', 'required', 'default_value', 'help_text'],
        validation_options: ['pattern']
      },
      url: {
        label: 'URL',
        description: 'Web address input',
        supports: ['placeholder', 'required', 'default_value', 'help_text'],
        validation_options: ['pattern']
      },
      date: {
        label: 'Date',
        description: 'Date picker input',
        supports: ['required', 'default_value', 'help_text'],
        validation_options: ['min', 'max']
      },
      textarea: {
        label: 'Textarea',
        description: 'Multi-line text input',
        supports: ['placeholder', 'required', 'default_value', 'help_text', 'max_length', 'min_length'],
        validation_options: ['minLength', 'maxLength']
      },
      select: {
        label: 'Dropdown Select',
        description: 'Dropdown selection list',
        supports: ['required', 'default_value', 'help_text', 'options'],
        validation_options: []
      },
      radio: {
        label: 'Radio Buttons',
        description: 'Single choice from multiple options',
        supports: ['required', 'default_value', 'help_text', 'options'],
        validation_options: []
      },
      checkbox: {
        label: 'Checkboxes',
        description: 'Multiple choice selection',
        supports: ['required', 'default_value', 'help_text', 'options'],
        validation_options: []
      },
      file: {
        label: 'File Upload',
        description: 'File upload input',
        supports: ['required', 'help_text'],
        validation_options: ['accept', 'maxSize', 'multiple']
      }
    };
    
    res.json({ success: true, data: fieldTypes });
  } catch (error) {
    console.error('Error fetching field types:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch field types' });
  }
});

export default router;