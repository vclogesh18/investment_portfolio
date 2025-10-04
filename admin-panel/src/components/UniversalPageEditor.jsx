import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
} from '@mui/material';
import {
  ExpandMore,
  Save,
  Refresh,
  Add,
  Edit,
  Delete,
  DragIndicator,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useContentAdmin } from '../hooks/usePageContent';
import ContentFieldEditor from './ContentFieldEditor';
import MediaSelector from './MediaSelector';

const CONTENT_TYPES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'text_section', label: 'Text Section' },
  { value: 'feature_list', label: 'Feature List' },
  { value: 'contact_info', label: 'Contact Info' },
  { value: 'office_locations', label: 'Office Locations' },
  { value: 'form_config', label: 'Form Configuration' },
  { value: 'investment_areas', label: 'Investment Areas' },
  { value: 'portfolio_companies', label: 'Portfolio Companies' },
  { value: 'team_members', label: 'Team Members' },
  { value: 'statistics', label: 'Statistics Section' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'call_to_action', label: 'Call to Action' },
];

const LAYOUT_TYPES = [
  { value: 'full_width', label: 'Full Width' },
  { value: 'two_column', label: 'Two Column' },
  { value: 'grid', label: 'Grid Layout' },
  { value: 'list', label: 'List Layout' },
];

export default function UniversalPageEditor({ pageSlug, pageTitle }) {
  const { user, getToken } = useAuth();
  const {
    data,
    loading,
    error,
    hero,
    sections,
    features,
    updateHero,
    addSection,
    updateSection,
    deleteSection,
    refresh
  } = useContentAdmin(pageSlug); // Remove token parameter, let the hook get it internally

  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [editDialog, setEditDialog] = useState({ open: false, type: 'hero', data: null, isNew: false });
  const [saving, setSaving] = useState(false);

  // Media selector state
  const [media, setMedia] = useState([]);
  const [openMediaSelector, setOpenMediaSelector] = useState(false);
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState(null);
  const [mediaSelectionType, setMediaSelectionType] = useState('hero'); // 'hero' or 'section'

  // Hero form state
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    background_image_url: '',
    background_color: '',
    text_color: '',
  });

  // Section form state
  const [sectionForm, setSectionForm] = useState({
    content_type: 'text_section',
    section_name: '',
    title: '',
    subtitle: '',
    description: '',
    content: {},
    layout_type: 'full_width',
    background_image_url: '',
    position: 0,
  });

  useEffect(() => {
    if (hero) {
      setHeroForm({
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        description: hero.description || '',
        background_image_url: hero.background_image_url || '',
        background_color: hero.background_color || '',
        text_color: hero.text_color || '',
      });
      // Set selected background image if exists
      if (hero.background_image_url && media.length > 0) {
        const backgroundMedia = media.find(m => m.file_path === hero.background_image_url);
        setSelectedBackgroundImage(backgroundMedia || null);
      }
    }
  }, [hero, media]);

  // Fetch media for background image selection
  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:5001/api/media-usage', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMedia(data.media || []);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    }
  };

  const openImageSelector = (type = 'hero') => {
    setMediaSelectionType(type);
    setOpenMediaSelector(true);
  };

  const handleImageSelect = (selectedMedia) => {
    if (mediaSelectionType === 'hero') {
      setHeroForm({ ...heroForm, background_image_url: selectedMedia.file_path });
      setSelectedBackgroundImage(selectedMedia);
    } else if (mediaSelectionType === 'section') {
      setSectionForm({ ...sectionForm, background_image_url: selectedMedia.file_path });
    }
    setOpenMediaSelector(false);
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 5000);
  };

  const handleSaveHero = async () => {
    try {
      setSaving(true);
      console.log('🔄 Saving hero section...', heroForm);
      console.log('🔑 Current user:', user);
      console.log('🎫 Token available:', !!getToken());
      
      await updateHero(heroForm);
      showAlert('Hero section updated successfully');
    } catch (error) {
      console.error('❌ Hero save error:', error);
      showAlert(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenSectionDialog = (type = 'new', section = null) => {
    if (type === 'new') {
      setSectionForm({
        content_type: 'text_section',
        section_name: '',
        title: '',
        subtitle: '',
        description: '',
        content: {},
        layout_type: 'full_width',
        background_image_url: '',
        position: sections.length,
      });
      setEditDialog({ open: true, type: 'section', data: null, isNew: true });
    } else if (type === 'edit' && section) {
      setSectionForm({
        content_type: section.type || 'text_section',
        section_name: section.section_name || '',
        title: section.title || '',
        subtitle: section.subtitle || '',
        description: section.description || '',
        content: section.content || {},
        layout_type: section.layout_type || 'full_width',
        background_image_url: section.background_image_url || '',
        position: section.position || 0,
      });
      setEditDialog({ open: true, type: 'section', data: section, isNew: false });
    }
  };

  const handleSaveSection = async () => {
    try {
      setSaving(true);
      if (editDialog.isNew) {
        await addSection(sectionForm);
        showAlert('Section added successfully');
      } else {
        await updateSection(editDialog.data.id, sectionForm);
        showAlert('Section updated successfully');
      }
      setEditDialog({ open: false, type: 'section', data: null, isNew: false });
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await deleteSection(sectionId);
        showAlert('Section deleted successfully');
      } catch (error) {
        showAlert(error.message, 'error');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading {pageTitle} content...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading page content: {error}
        </Alert>
        <Button onClick={refresh} startIcon={<Refresh />}>
          Retry
        </Button>
      </Box>
    );
  }

  // Check authentication
  if (!user) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          You must be logged in to edit page content.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {pageTitle} Page Content
        </Typography>
        <Button
          onClick={refresh}
          startIcon={<Refresh />}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {/* Hero Section */}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Hero Section</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subtitle"
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={heroForm.description}
                onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                  Background Image
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<ImageIcon />}
                    onClick={() => openImageSelector('hero')}
                    sx={{ 
                      borderColor: '#e2e8f0',
                      color: '#64748b',
                      '&:hover': { 
                        borderColor: '#f59e0b', 
                        backgroundColor: '#fef3c7' 
                      }
                    }}
                  >
                    {selectedBackgroundImage ? 'Change Image' : 'Select Image'}
                  </Button>
                  {selectedBackgroundImage && (
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={`http://localhost:5001${selectedBackgroundImage.file_path}`}
                        sx={{ width: 40, height: 40 }}
                      >
                        <ImageIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {selectedBackgroundImage.original_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedBackgroundImage.file_size ? `${(selectedBackgroundImage.file_size / 1024).toFixed(1)} KB` : ''}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedBackgroundImage(null);
                          setHeroForm({ ...heroForm, background_image_url: '' });
                        }}
                        sx={{ color: '#ef4444' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Background Color"
                value={heroForm.background_color}
                onChange={(e) => setHeroForm({ ...heroForm, background_color: e.target.value })}
                placeholder="#ffffff"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Text Color"
                value={heroForm.text_color}
                onChange={(e) => setHeroForm({ ...heroForm, text_color: e.target.value })}
                placeholder="#000000"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={handleSaveHero}
                startIcon={<Save />}
                variant="contained"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Hero Section'}
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Content Sections */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Content Sections</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <Button
              onClick={() => handleOpenSectionDialog('new')}
              startIcon={<Add />}
              variant="outlined"
            >
              Add New Section
            </Button>
          </Box>

          <List>
            {[...sections, ...features].sort((a, b) => a.position - b.position).map((section, index) => (
              <ListItem key={section.id || index} sx={{ border: 1, borderColor: 'divider', mb: 1, borderRadius: 1 }}>
                <IconButton sx={{ mr: 1 }}>
                  <DragIndicator />
                </IconButton>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{section.title || 'Untitled'}</Typography>
                      <Chip label={section.type || section.content_type} size="small" />
                      <Chip label={section.layout_type || 'default'} size="small" variant="outlined" />
                    </Box>
                  }
                  secondary={section.description?.substring(0, 100) + (section.description?.length > 100 ? '...' : '')}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleOpenSectionDialog('edit', section)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteSection(section.id)} color="error">
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Section Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ ...editDialog, open: false })} maxWidth="md" fullWidth>
        <DialogTitle>
          {editDialog.isNew ? 'Add New Section' : 'Edit Section'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Content Type</InputLabel>
                <Select
                  value={sectionForm.content_type}
                  onChange={(e) => setSectionForm({ ...sectionForm, content_type: e.target.value })}
                  label="Content Type"
                >
                  {CONTENT_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Layout Type</InputLabel>
                <Select
                  value={sectionForm.layout_type}
                  onChange={(e) => setSectionForm({ ...sectionForm, layout_type: e.target.value })}
                  label="Layout Type"
                >
                  {LAYOUT_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Section Name (internal identifier)"
                value={sectionForm.section_name}
                onChange={(e) => setSectionForm({ ...sectionForm, section_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={sectionForm.title}
                onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subtitle"
                value={sectionForm.subtitle}
                onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={sectionForm.description}
                onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                  Background Image
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<ImageIcon />}
                    onClick={() => openImageSelector('section')}
                    sx={{ 
                      borderColor: '#e2e8f0',
                      color: '#64748b',
                      '&:hover': { 
                        borderColor: '#f59e0b', 
                        backgroundColor: '#fef3c7' 
                      }
                    }}
                  >
                    Select Background Image
                  </Button>
                  {sectionForm.background_image_url && (
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={`http://localhost:5001${sectionForm.background_image_url}`}
                        sx={{ width: 40, height: 40 }}
                      >
                        <ImageIcon />
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>
                        Background image selected
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => setSectionForm({ ...sectionForm, background_image_url: '' })}
                        sx={{ color: '#ef4444' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                Content Fields
              </Typography>
              <ContentFieldEditor
                contentType={sectionForm.content_type}
                content={sectionForm.content}
                onChange={(newContent) => setSectionForm({ ...sectionForm, content: newContent })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ ...editDialog, open: false })}>
            Cancel
          </Button>
          <Button onClick={handleSaveSection} variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save Section'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Selector Dialog */}
      <MediaSelector
        open={openMediaSelector}
        onClose={() => setOpenMediaSelector(false)}
        onSelect={handleImageSelect}
        title="Select Background Image"
        category="hero-backgrounds"
      />
    </Box>
  );
}