import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Edit, Delete, Add, DragIndicator } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const AboutContent = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchAboutContent();
  }, [user]);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/pages/about', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPage(data.page);
        setContent(data.content || []);
      } else {
        setError('Failed to fetch about page content');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching content');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePageMeta = async (formData) => {
    try {
      const response = await fetch('http://localhost:5001/api/pages/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess('Page metadata updated successfully');
        fetchAboutContent();
      } else {
        setError('Failed to update page metadata');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error updating page metadata');
    }
  };

  const handleUpdateContent = async (contentData) => {
    try {
      const url = editingContent?.id 
        ? `http://localhost:5001/api/pages/about/content/${editingContent.id}`
        : 'http://localhost:5001/api/pages/about/content';
      
      const method = editingContent?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(contentData)
      });

      if (response.ok) {
        setSuccess(`Content ${editingContent?.id ? 'updated' : 'created'} successfully`);
        setOpenDialog(false);
        setEditingContent(null);
        fetchAboutContent();
      } else {
        setError(`Failed to ${editingContent?.id ? 'update' : 'create'} content`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error saving content');
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this content section?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/pages/about/content/${contentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        setSuccess('Content deleted successfully');
        fetchAboutContent();
      } else {
        setError('Failed to delete content');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error deleting content');
    }
  };

  const openEditDialog = (content = null) => {
    setEditingContent(content);
    setOpenDialog(true);
  };

  if (loading) return <Typography>Loading about page content...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        About Page Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Page Metadata Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Page Metadata
        </Typography>
        <PageMetaForm page={page} onSubmit={handleUpdatePageMeta} />
      </Paper>

      {/* Content Sections */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Content Sections ({content.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openEditDialog()}
          >
            Add Content Section
          </Button>
        </Box>

        <Grid container spacing={2}>
          {content.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Chip 
                        label={item.content_type} 
                        size="small" 
                        color="primary" 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="h6" noWrap>
                        {item.title || item.section_name || 'Untitled'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {item.subtitle || item.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <DragIndicator />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteContent(item.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="caption" display="block">
                    Position: {item.position} | Active: {item.is_active ? 'Yes' : 'No'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Content Edit Dialog */}
      <ContentEditDialog
        open={openDialog}
        content={editingContent}
        onClose={() => {
          setOpenDialog(false);
          setEditingContent(null);
        }}
        onSubmit={handleUpdateContent}
      />
    </Box>
  );
};

// Page Metadata Form Component
const PageMetaForm = ({ page, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    meta_description: '',
    meta_title: '',
    meta_keywords: '',
    og_image: '',
    canonical_url: '',
    status: 'published'
  });

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        meta_description: page.meta_description || '',
        meta_title: page.meta_title || '',
        meta_keywords: page.meta_keywords || '',
        og_image: page.og_image || '',
        canonical_url: page.canonical_url || '',
        status: page.status || 'published'
      });
    }
  }, [page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Page Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Meta Title"
            value={formData.meta_title}
            onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Meta Description"
            value={formData.meta_description}
            onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Meta Keywords"
            value={formData.meta_keywords}
            onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained">
            Update Page Metadata
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

// Content Edit Dialog Component
const ContentEditDialog = ({ open, content, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    content_type: 'text',
    section_name: '',
    title: '',
    subtitle: '',
    description: '',
    content: '',
    background_image_url: '',
    background_color: '',
    text_color: '',
    layout_type: 'default',
    position: 0,
    is_active: true
  });

  useEffect(() => {
    if (content) {
      setFormData({
        content_type: content.content_type || 'text',
        section_name: content.section_name || '',
        title: content.title || '',
        subtitle: content.subtitle || '',
        description: content.description || '',
        content: content.content ? JSON.stringify(content.content, null, 2) : '',
        background_image_url: content.background_image_url || '',
        background_color: content.background_color || '',
        text_color: content.text_color || '',
        layout_type: content.layout_type || 'default',
        position: content.position || 0,
        is_active: content.is_active !== false
      });
    } else {
      // Reset form for new content
      setFormData({
        content_type: 'text',
        section_name: '',
        title: '',
        subtitle: '',
        description: '',
        content: '',
        background_image_url: '',
        background_color: '',
        text_color: '',
        layout_type: 'default',
        position: 0,
        is_active: true
      });
    }
  }, [content, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = { ...formData };
    
    // Parse content JSON if it exists
    if (submitData.content) {
      try {
        submitData.content = JSON.parse(submitData.content);
      } catch (error) {
        console.error('Invalid JSON in content field');
        return;
      }
    }
    
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {content ? 'Edit Content Section' : 'Add Content Section'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Content Type</InputLabel>
                <Select
                  value={formData.content_type}
                  label="Content Type"
                  onChange={(e) => setFormData({...formData, content_type: e.target.value})}
                >
                  <MenuItem value="hero">Hero</MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="features">Features</MenuItem>
                  <MenuItem value="image-text">Image & Text</MenuItem>
                  <MenuItem value="grid">Grid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Section Name"
                value={formData.section_name}
                onChange={(e) => setFormData({...formData, section_name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Content (JSON format)"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                helperText="Enter structured content as JSON"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Position"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: parseInt(e.target.value)})}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Layout Type</InputLabel>
                <Select
                  value={formData.layout_type}
                  label="Layout Type"
                  onChange={(e) => setFormData({...formData, layout_type: e.target.value})}
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="centered">Centered</MenuItem>
                  <MenuItem value="full-width">Full Width</MenuItem>
                  <MenuItem value="sidebar">Sidebar</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.is_active}
                  label="Status"
                  onChange={(e) => setFormData({...formData, is_active: e.target.value})}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {content ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AboutContent;