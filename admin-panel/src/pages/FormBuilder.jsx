import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Tooltip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  DragIndicator as DragIndicatorIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  TextFields as TextFieldsIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as DescriptionIcon,
  List as ListIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
  CheckBox as CheckBoxIcon,
  Attachment as AttachmentIcon,
  DateRange as DateRangeIcon,
  Link as LinkIcon,
  Numbers as NumbersIcon
} from '@mui/icons-material';

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    success_message: 'Thank you for your submission!',
    notification_email: '',
    active: true,
    fields: []
  });

  const [fieldTypes, setFieldTypes] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0 for builder, 1 for preview
  const [editingField, setEditingField] = useState(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const fieldTypeIcons = {
    text: <TextFieldsIcon />,
    email: <EmailIcon />,
    tel: <PhoneIcon />,
    number: <NumbersIcon />,
    textarea: <DescriptionIcon />,
    select: <ListIcon />,
    radio: <RadioButtonCheckedIcon />,
    checkbox: <CheckBoxIcon />,
    file: <AttachmentIcon />,
    date: <DateRangeIcon />,
    url: <LinkIcon />
  };

  useEffect(() => {
    fetchFieldTypes();
    if (isEditing) {
      fetchForm();
    }
  }, [id]);

  const fetchFieldTypes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/form-fields/field-types`);
      const result = await response.json();
      if (result.success) {
        setFieldTypes(result.data);
      }
    } catch (error) {
      console.error('Error fetching field types:', error);
    }
  };

  const fetchForm = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forms/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch form');
      }

      const result = await response.json();
      if (result.success) {
        setForm(result.data);
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveForm = async () => {
    try {
      setSaving(true);
      setError('');

      const token = localStorage.getItem('adminToken');
      const url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/api/forms/${id}`
        : `${import.meta.env.VITE_API_URL}/api/forms`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('Failed to save form');
      }

      const result = await response.json();
      if (result.success) {
        navigate('/forms');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const addField = (type) => {
    const newField = {
      id: Date.now(), // Temporary ID for new fields
      label: `New ${fieldTypes[type]?.label || type}`,
      name: `field_${Date.now()}`,
      type,
      placeholder: '',
      required: false,
      field_order: form.fields.length + 1,
      options: type === 'select' || type === 'radio' || type === 'checkbox' 
        ? { options: [{ value: 'option1', label: 'Option 1' }] }
        : null,
      validation_rules: {},
      default_value: '',
      help_text: '',
      max_length: null,
      min_length: null
    };

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId, updates) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const deleteField = (fieldId) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const duplicateField = (field) => {
    const newField = {
      ...field,
      id: Date.now(),
      name: `${field.name}_copy`,
      label: `${field.label} (Copy)`,
      field_order: form.fields.length + 1
    };

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(form.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update field orders
    const updatedItems = items.map((item, index) => ({
      ...item,
      field_order: index + 1
    }));

    setForm(prev => ({
      ...prev,
      fields: updatedItems
    }));
  };

  const renderFieldPreview = (field) => {
    const baseClassName = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            className={baseClassName}
            rows={3}
            disabled
          />
        );
      
      case 'select':
        return (
          <select className={baseClassName} disabled>
            <option>Select an option</option>
            {field.options?.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input type="radio" name={field.name} value={option.value} disabled />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input type="checkbox" value={option.value} disabled />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'file':
        return (
          <input
            type="file"
            className={baseClassName}
            disabled
          />
        );
      
      default:
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className={baseClassName}
            disabled
          />
        );
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={() => navigate('/forms')}
              sx={{ color: 'white', mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {isEditing ? 'Edit Form' : 'Create New Form'}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {isEditing ? `Editing: ${form.name}` : 'Build a dynamic form for your website'}
              </Typography>
            </Box>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={activeTab === 0 ? <VisibilityIcon /> : <EditIcon />}
              onClick={() => setActiveTab(activeTab === 0 ? 1 : 0)}
              sx={{ 
                backgroundColor: 'white', 
                color: 'primary.main',
                '&:hover': { backgroundColor: 'grey.100' }
              }}
            >
              {activeTab === 0 ? 'Preview' : 'Builder'}
            </Button>
            
            <Button
              variant="contained"
              color="success"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={saveForm}
              disabled={saving}
              sx={{ minWidth: 120 }}
            >
              {saving ? 'Saving...' : 'Save Form'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="Form Builder" icon={<EditIcon />} iconPosition="start" />
          <Tab label="Preview" icon={<VisibilityIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {/* Form Settings Sidebar */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 24 }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <SettingsIcon sx={{ mr: 1 }} />
              Form Settings
            </Typography>
            
            <Stack spacing={3}>
              <TextField
                label="Form Name"
                required
                fullWidth
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Contact Form"
              />

              <TextField
                label="Slug"
                required
                fullWidth
                value={form.slug}
                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="contact"
                helperText={`Used in URL: /forms/${form.slug}`}
              />

              <TextField
                label="Description"
                multiline
                rows={3}
                fullWidth
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this form..."
              />

              <TextField
                label="Success Message"
                multiline
                rows={2}
                fullWidth
                value={form.success_message}
                onChange={(e) => setForm(prev => ({ ...prev, success_message: e.target.value }))}
                placeholder="Thank you for your submission!"
              />

              <TextField
                label="Notification Email"
                type="email"
                fullWidth
                value={form.notification_email}
                onChange={(e) => setForm(prev => ({ ...prev, notification_email: e.target.value }))}
                placeholder="admin@example.com"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={form.active}
                    onChange={(e) => setForm(prev => ({ ...prev, active: e.target.checked }))}
                  />
                }
                label="Form is active"
              />
            </Stack>

            {/* Field Types */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Add Fields
            </Typography>
            <Grid container spacing={1}>
              {Object.entries(fieldTypes).map(([type, config]) => (
                <Grid item xs={12} sm={6} key={type}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={fieldTypeIcons[type] || <AddIcon />}
                    onClick={() => addField(type)}
                    sx={{ 
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      py: 1.5,
                      px: 2
                    }}
                  >
                    <Box>
                      <Typography variant="caption" display="block" fontWeight="bold">
                        {config.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {config.description}
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Form Builder / Preview */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: 3, minHeight: '60vh' }}>
            {activeTab === 0 ? (
              <>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                  <EditIcon sx={{ mr: 1 }} />
                  Form Fields
                </Typography>
                
                {form.fields.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <AddIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No fields added yet
                    </Typography>
                    <Typography color="text.secondary">
                      Use the field types on the left to start building your form.
                    </Typography>
                  </Box>
                ) : (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="form-fields">
                      {(provided) => (
                        <Box {...provided.droppableProps} ref={provided.innerRef}>
                          <Stack spacing={2}>
                            {form.fields
                              .sort((a, b) => a.field_order - b.field_order)
                              .map((field, index) => (
                                <Draggable key={field.id} draggableId={field.id.toString()} index={index}>
                                  {(provided, snapshot) => (
                                    <Card
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      elevation={snapshot.isDragging ? 4 : 1}
                                      sx={{
                                        backgroundColor: snapshot.isDragging ? 'action.hover' : 'background.paper',
                                        transform: snapshot.isDragging ? 'rotate(5deg)' : 'none'
                                      }}
                                    >
                                      <CardContent sx={{ pb: 1 }}>
                                        <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
                                          <Box display="flex" alignItems="center" flexGrow={1}>
                                            <Box {...provided.dragHandleProps} sx={{ cursor: 'grab', mr: 2 }}>
                                              <DragIndicatorIcon color="action" />
                                            </Box>
                                            <Box flexGrow={1}>
                                              <Typography variant="subtitle1" fontWeight="bold">
                                                {field.label}
                                              </Typography>
                                              <Stack direction="row" spacing={1} alignItems="center">
                                                <Chip 
                                                  label={field.name} 
                                                  size="small" 
                                                  variant="outlined" 
                                                />
                                                <Chip 
                                                  label={fieldTypes[field.type]?.label || field.type} 
                                                  size="small" 
                                                  color="primary" 
                                                />
                                                {field.required && (
                                                  <Chip 
                                                    label="Required" 
                                                    size="small" 
                                                    color="error" 
                                                  />
                                                )}
                                              </Stack>
                                            </Box>
                                          </Box>
                                          
                                          <Stack direction="row" spacing={1}>
                                            <Tooltip title="Edit field">
                                              <IconButton
                                                size="small"
                                                onClick={() => setEditingField(field)}
                                                color="primary"
                                              >
                                                <EditIcon />
                                              </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Duplicate field">
                                              <IconButton
                                                size="small"
                                                onClick={() => duplicateField(field)}
                                                color="info"
                                              >
                                                <FileCopyIcon />
                                              </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete field">
                                              <IconButton
                                                size="small"
                                                onClick={() => deleteField(field.id)}
                                                color="error"
                                              >
                                                <DeleteIcon />
                                              </IconButton>
                                            </Tooltip>
                                          </Stack>
                                        </Box>
                                        
                                        <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                                          <Typography variant="subtitle2" gutterBottom>
                                            {field.label}
                                            {field.required && <Typography component="span" color="error"> *</Typography>}
                                          </Typography>
                                          {renderFieldPreview(field)}
                                          {field.help_text && (
                                            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                                              {field.help_text}
                                            </Typography>
                                          )}
                                        </Paper>
                                      </CardContent>
                                    </Card>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </Stack>
                        </Box>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                  <VisibilityIcon sx={{ mr: 1 }} />
                  Form Preview
                </Typography>
                <Box maxWidth="md">
                  {form.description && (
                    <Typography color="text.secondary" paragraph>
                      {form.description}
                    </Typography>
                  )}
                  
                  <Paper variant="outlined" sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      {form.fields
                        .sort((a, b) => a.field_order - b.field_order)
                        .map((field) => (
                          <Box key={field.id}>
                            <Typography variant="subtitle2" gutterBottom>
                              {field.label}
                              {field.required && <Typography component="span" color="error"> *</Typography>}
                            </Typography>
                            {renderFieldPreview(field)}
                            {field.help_text && (
                              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                                {field.help_text}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled
                        sx={{ mt: 3 }}
                      >
                        Submit Form
                      </Button>
                    </Stack>
                  </Paper>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Field Edit Modal */}
      {editingField && (
        <FieldEditModal
          field={editingField}
          fieldTypes={fieldTypes}
          onSave={(updates) => {
            updateField(editingField.id, updates);
            setEditingField(null);
          }}
          onCancel={() => setEditingField(null)}
        />
      )}
    </Container>
  );
};

// Field Edit Modal Component
const FieldEditModal = ({ field, fieldTypes, onSave, onCancel }) => {
  const [editForm, setEditForm] = useState({ ...field });

  const handleSave = () => {
    onSave(editForm);
  };

  const addOption = () => {
    const newOptions = {
      ...editForm.options,
      options: [
        ...(editForm.options?.options || []),
        { value: '', label: '' }
      ]
    };
    setEditForm(prev => ({ ...prev, options: newOptions }));
  };

  const updateOption = (index, key, value) => {
    const newOptions = {
      ...editForm.options,
      options: editForm.options.options.map((option, i) => 
        i === index ? { ...option, [key]: value } : option
      )
    };
    setEditForm(prev => ({ ...prev, options: newOptions }));
  };

  const removeOption = (index) => {
    const newOptions = {
      ...editForm.options,
      options: editForm.options.options.filter((_, i) => i !== index)
    };
    setEditForm(prev => ({ ...prev, options: newOptions }));
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <EditIcon sx={{ mr: 1 }} />
          Edit Field: {field.label}
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Field Label"
                required
                fullWidth
                value={editForm.label}
                onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Enter field label"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Field Name"
                required
                fullWidth
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="field_name"
                helperText="Used in form data"
              />
            </Grid>
          </Grid>

          <TextField
            label="Placeholder"
            fullWidth
            value={editForm.placeholder || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, placeholder: e.target.value }))}
            placeholder="Placeholder text"
          />

          <TextField
            label="Help Text"
            fullWidth
            value={editForm.help_text || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, help_text: e.target.value }))}
            placeholder="Optional help text for users"
          />

          <FormControlLabel
            control={
              <Switch
                checked={editForm.required || false}
                onChange={(e) => setEditForm(prev => ({ ...prev, required: e.target.checked }))}
              />
            }
            label="Required field"
          />

          {/* Options for select, radio, checkbox */}
          {(['select', 'radio', 'checkbox'].includes(editForm.type)) && (
            <Box>
              <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
                <Typography variant="h6">Options</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addOption}
                  variant="outlined"
                  size="small"
                >
                  Add Option
                </Button>
              </Box>
              
              <Stack spacing={2}>
                {editForm.options?.options?.map((option, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1}>
                    <TextField
                      size="small"
                      placeholder="Value"
                      value={option.value}
                      onChange={(e) => updateOption(index, 'value', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      placeholder="Label"
                      value={option.label}
                      onChange={(e) => updateOption(index, 'label', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => removeOption(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )) || []}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
        >
          Save Field
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormBuilder;