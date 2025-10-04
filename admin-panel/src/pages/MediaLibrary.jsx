import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  CircularProgress,
  Badge,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Edit,
  Search,
  FilterList,
  Visibility,
  Link as LinkIcon,
  Person,
  Article,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function MediaLibrary() {
  const { getToken } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editDialog, setEditDialog] = useState({ open: false, item: null });
  const [uploadDialog, setUploadDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState({ open: false, item: null });
  const [usageDialog, setUsageDialog] = useState({ open: false, item: null, usage: [] });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadData, setUploadData] = useState({
    alt_text: '',
    category: 'brand'
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'team', label: 'Team Members' },
    { value: 'portfolio', label: 'Portfolio Companies' },
    { value: 'brand', label: 'Brand Assets' },
    { value: 'investment-classes', label: 'Investment Classes' },
    { value: 'hero-backgrounds', label: 'Hero Backgrounds' },
  ];

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      // Fetch media with usage information
      const response = await axios.get('http://localhost:5001/api/media-usage', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMedia(response.data.media || []);
    } catch (error) {
      setError('Failed to fetch media');
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      setError('Please select a file');
      return;
    }

    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('alt_text', uploadData.alt_text);
      formData.append('category', uploadData.category);

      await axios.post('http://localhost:5001/api/media/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('File uploaded successfully');
      setUploadDialog(false);
      setUploadFile(null);
      setUploadData({ alt_text: '', category: 'brand' });
      fetchMedia();
    } catch (error) {
      setError('Failed to upload file');
      console.error('Error uploading file:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) {
      return;
    }

    try {
      const token = getToken();
      await axios.delete(`http://localhost:5001/api/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Media item deleted successfully');
      fetchMedia();
    } catch (error) {
      setError('Failed to delete media item');
      console.error('Error deleting media:', error);
    }
  };

  const handleEditSave = async () => {
    try {
      const token = getToken();
      await axios.put(`http://localhost:5001/api/media/${editDialog.item.id}`, {
        alt_text: editDialog.item.alt_text,
        category: editDialog.item.category
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Media item updated successfully');
      setEditDialog({ open: false, item: null });
      fetchMedia();
    } catch (error) {
      setError('Failed to update media item');
      console.error('Error updating media:', error);
    }
  };

  const handleViewUsage = async (item) => {
    try {
      const token = getToken();
      const response = await axios.get(`http://localhost:5001/api/media-usage/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsageDialog({ 
        open: true, 
        item, 
        usage: response.data.usage || [] 
      });
    } catch (error) {
      setError('Failed to fetch usage details');
      console.error('Error fetching usage:', error);
    }
  };

  const handlePreview = (item) => {
    setPreviewDialog({ open: true, item });
  };

  const getUsageIcon = (type) => {
    switch (type) {
      case 'team_member':
        return <Person fontSize="small" />;
      case 'page_hero':
      case 'page_og':
      case 'page_content':
        return <Article fontSize="small" />;
      default:
        return <ImageIcon fontSize="small" />;
    }
  };

  const getUsageColor = (usageCount) => {
    if (usageCount === 0) return 'default';
    if (usageCount === 1) return 'primary';
    if (usageCount <= 3) return 'warning';
    return 'error';
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b', mb: 3 }}>
        Media Library
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => setUploadDialog(true)}
          >
            Upload Media
          </Button>
          
          <TextField
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{ minWidth: 250 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="body2" color="text.secondary">
            {filteredMedia.length} of {media.length} items
          </Typography>
        </Box>
      </Paper>

      {/* Media Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredMedia.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5001${item.file_path}`}
                  alt={item.alt_text}
                  sx={{ objectFit: 'contain', bgcolor: 'grey.100', cursor: 'pointer' }}
                  onClick={() => handlePreview(item)}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle2" noWrap title={item.filename} sx={{ flex: 1, mr: 1 }}>
                      {item.filename}
                    </Typography>
                    <Badge 
                      badgeContent={item.total_usage || 0} 
                      color={getUsageColor(item.total_usage || 0)}
                      showZero
                    >
                      <LinkIcon fontSize="small" />
                    </Badge>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {item.alt_text}
                  </Typography>
                  <Chip label={item.category} size="small" variant="outlined" sx={{ mb: 1 }} />
                  <Typography variant="caption" display="block">
                    {item.file_size ? `${(item.file_size / 1024).toFixed(1)}KB` : 'Size unknown'} • {item.mime_type}
                  </Typography>
                  {item.total_usage > 0 && (
                    <Typography variant="caption" color="primary" display="block" sx={{ mt: 0.5 }}>
                      Used in {item.total_usage} place{item.total_usage !== 1 ? 's' : ''}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Box>
                    <Tooltip title="Preview">
                      <IconButton 
                        size="small" 
                        onClick={() => handlePreview(item)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Usage">
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewUsage(item)}
                        color={item.total_usage > 0 ? 'primary' : 'default'}
                      >
                        <LinkIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        onClick={() => setEditDialog({ open: true, item: { ...item } })}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(item.id)}
                        disabled={item.total_usage > 0}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Media</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: 100 }}
            >
              {uploadFile ? uploadFile.name : 'Choose File'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files[0])}
              />
            </Button>
            
            <TextField
              label="Alt Text"
              value={uploadData.alt_text}
              onChange={(e) => setUploadData({ ...uploadData, alt_text: e.target.value })}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={uploadData.category}
                onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                label="Category"
              >
                {categories.slice(1).map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, item: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Media</DialogTitle>
        <DialogContent>
          {editDialog.item && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <img
                src={editDialog.item.file_path}
                alt={editDialog.item.alt_text}
                style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
              />
              
              <TextField
                label="Alt Text"
                value={editDialog.item.alt_text || ''}
                onChange={(e) => setEditDialog({
                  ...editDialog,
                  item: { ...editDialog.item, alt_text: e.target.value }
                })}
                fullWidth
              />
              
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editDialog.item.category || ''}
                  onChange={(e) => setEditDialog({
                    ...editDialog,
                    item: { ...editDialog.item, category: e.target.value }
                  })}
                  label="Category"
                >
                  {categories.slice(1).map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, item: null })}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog 
        open={previewDialog.open} 
        onClose={() => setPreviewDialog({ open: false, item: null })} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Image Preview
          {previewDialog.item && (
            <Typography variant="subtitle2" color="text.secondary">
              {previewDialog.item.filename}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {previewDialog.item && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <img
                src={`http://localhost:5001${previewDialog.item.file_path}`}
                alt={previewDialog.item.alt_text}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh', 
                  objectFit: 'contain',
                  borderRadius: 8 
                }}
              />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{previewDialog.item.filename}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {previewDialog.item.alt_text}
                </Typography>
                <Chip label={previewDialog.item.category} size="small" variant="outlined" sx={{ mr: 1 }} />
                <Chip 
                  label={`${previewDialog.item.file_size ? `${(previewDialog.item.file_size / 1024).toFixed(1)}KB` : 'Size unknown'}`} 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog({ open: false, item: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Usage Dialog */}
      <Dialog 
        open={usageDialog.open} 
        onClose={() => setUsageDialog({ open: false, item: null, usage: [] })} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          Media Usage
          {usageDialog.item && (
            <Typography variant="subtitle2" color="text.secondary">
              {usageDialog.item.filename}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {usageDialog.item && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <img
                  src={`http://localhost:5001${usageDialog.item.file_path}`}
                  alt={usageDialog.item.alt_text}
                  style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 4 }}
                />
                <Box>
                  <Typography variant="subtitle1">{usageDialog.item.filename}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {usageDialog.item.alt_text}
                  </Typography>
                  <Badge 
                    badgeContent={usageDialog.usage.length} 
                    color={getUsageColor(usageDialog.usage.length)}
                    sx={{ mt: 1 }}
                  >
                    <Chip label="Used in" size="small" />
                  </Badge>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {usageDialog.usage.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  This image is not currently being used anywhere.
                </Typography>
              ) : (
                <List>
                  {usageDialog.usage.map((usage, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {getUsageIcon(usage.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={usage.title || usage.name}
                        secondary={
                          <Box>
                            <Typography variant="caption" color="primary">
                              {usage.type_label}
                            </Typography>
                            {usage.page_title && (
                              <Typography variant="caption" display="block">
                                Page: {usage.page_title}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUsageDialog({ open: false, item: null, usage: [] })}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}