import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Search,
  CheckCircle,
  Cancel,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const MediaSelector = ({ 
  open, 
  onClose, 
  onSelect, 
  selectedImageId = null,
  category = 'team', // Default to team images
  title = 'Select Image'
}) => {
  const { getToken } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedImage, setSelectedImage] = useState(selectedImageId);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'team', label: 'Team Members' },
    { value: 'portfolio', label: 'Portfolio Companies' },
    { value: 'brand', label: 'Brand Assets' },
    { value: 'investment-classes', label: 'Investment Classes' },
    { value: 'hero-backgrounds', label: 'Hero Backgrounds' },
  ];

  useEffect(() => {
    if (open) {
      fetchMedia();
      setSelectedImage(selectedImageId);
    }
  }, [open, selectedImageId]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const token = getToken();
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

  const handleSelect = () => {
    console.log('MediaSelector - handleSelect called, selectedImage:', selectedImage);
    if (selectedImage) {
      const selectedMediaItem = media.find(item => item.id === selectedImage);
      console.log('MediaSelector - found media item:', selectedMediaItem);
      onSelect(selectedMediaItem);
    }
    onClose();
  };

  const handleClear = () => {
    setSelectedImage(null);
    onSelect(null);
    onClose();
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ImageIcon />
          {title}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {/* Search and Filter Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search images..."
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
          
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
            {filteredMedia.length} image{filteredMedia.length !== 1 ? 's' : ''} found
          </Typography>
        </Box>

        {/* Media Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
            <Grid container spacing={2}>
              {filteredMedia.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      cursor: 'pointer',
                      border: selectedImage === item.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => {
                      console.log('MediaSelector - Card clicked, item.id:', item.id);
                      setSelectedImage(item.id);
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="150"
                        image={`http://localhost:5001${item.file_path.startsWith('/') ? item.file_path : '/uploads/' + item.file_path}`}
                        alt={item.alt_text}
                        sx={{ objectFit: 'contain', bgcolor: 'grey.100' }}
                        onError={(e) => {
                          console.log('Image failed to load:', item.file_path);
                          e.target.style.display = 'none';
                        }}
                      />
                      {selectedImage === item.id && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'primary.main',
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <CheckCircle fontSize="small" />
                        </Box>
                      )}
                      {item.total_usage > 0 && (
                        <Badge 
                          badgeContent={item.total_usage} 
                          color="primary"
                          sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            left: 8 
                          }}
                        >
                          <Chip 
                            label="In Use" 
                            size="small" 
                            color="primary" 
                            variant="filled"
                          />
                        </Badge>
                      )}
                    </Box>
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="caption" noWrap title={item.filename}>
                        {item.filename}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {item.alt_text}
                      </Typography>
                      <Chip 
                        label={item.category} 
                        size="small" 
                        variant="outlined" 
                        sx={{ mt: 0.5 }} 
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {filteredMedia.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No images found matching your criteria
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleClear} color="warning" disabled={!selectedImageId}>
          Clear Image
        </Button>
        <Button 
          onClick={handleSelect} 
          variant="contained" 
          disabled={!selectedImage}
        >
          Select Image
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaSelector;