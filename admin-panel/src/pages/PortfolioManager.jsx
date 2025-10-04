import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  Chip,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Language as WebsiteIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import MediaSelector from '../components/MediaSelector';

const API_BASE_URL = 'http://localhost:5001/api';

export default function PortfolioManager() {
  const [companies, setCompanies] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openMediaSelector, setOpenMediaSelector] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deletingCompany, setDeletingCompany] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    sector: '',
    logo_id: '',
    position: 0
  });

  // Predefined sectors for consistency
  const sectors = [
    'AI Technology',
    'MedTech',
    'Green Technology',
    'FinTech',
    'Robotics',
    'Quantum Computing',
    'Biotechnology',
    'Cybersecurity',
    'IoT',
    'Blockchain',
    'Other'
  ];

  // Fetch companies and media on component mount
  useEffect(() => {
    fetchCompanies();
    fetchMedia();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/portfolio`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      } else {
        setError('Failed to fetch portfolio companies');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/media-usage', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('PortfolioManager - fetchMedia response:', data);
        setMedia(data.media || []);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingCompany 
        ? `${API_BASE_URL}/portfolio/${editingCompany.id}`
        : `${API_BASE_URL}/portfolio`;
      
      const method = editingCompany ? 'PUT' : 'POST';
      
      // Clean up the form data before sending
      const cleanedData = {
        ...formData,
        logo_id: formData.logo_id === '' ? null : parseInt(formData.logo_id) || null,
        position: parseInt(formData.position) || 0
      };
      
      console.log('Sending data:', cleanedData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanedData)
      });

      if (response.ok) {
        setSuccess(editingCompany ? 'Company updated successfully' : 'Company created successfully');
        setDialogOpen(false);
        resetForm();
        fetchCompanies();
      } else {
        const errorData = await response.json();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          url,
          method,
          sentData: cleanedData
        });
        setError(errorData.error || `Failed to save company (${response.status})`);
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Network Error:', err);
    }
  };

  const handleDelete = async () => {
    if (!deletingCompany) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/portfolio/${deletingCompany.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess('Company deleted successfully');
        setDeleteDialogOpen(false);
        setDeletingCompany(null);
        fetchCompanies();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete company');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingCompany(null);
    setDialogOpen(true);
  };

  const openEditDialog = (company) => {
    setFormData({
      name: company.name || '',
      description: company.description || '',
      website: company.website || '',
      sector: company.sector || '',
      logo_id: company.logo_id ? company.logo_id.toString() : '',
      position: company.position || 0
    });
    // Set selected logo for preview
    if (company.logo_id) {
      console.log('PortfolioManager - looking for logo_id:', company.logo_id, 'type:', typeof company.logo_id);
      console.log('PortfolioManager - media array length:', media.length);
      console.log('PortfolioManager - media IDs:', media.map(m => ({ id: m.id, type: typeof m.id, filename: m.filename })));
      const logoMedia = media.find(m => m.id == company.logo_id); // Use == for type coercion
      console.log('PortfolioManager - found logoMedia:', logoMedia);
      setSelectedLogo(logoMedia || null);
    } else {
      console.log('PortfolioManager - no logo_id on company');
      setSelectedLogo(null);
    }
    setEditingCompany(company);
    setDialogOpen(true);
  };

  const openDeleteDialog = (company) => {
    setDeletingCompany(company);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      website: '',
      sector: '',
      logo_id: '',
      position: 0
    });
    setSelectedLogo(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openImageSelector = () => {
    setOpenMediaSelector(true);
  };

  const handleImageSelect = (media) => {
    console.log('PortfolioManager - handleImageSelect called with:', media);
    setSelectedLogo(media);
    setFormData(prev => ({
      ...prev,
      logo_id: media.id.toString()
    }));
    console.log('PortfolioManager - selectedLogo set to:', media);
    console.log('PortfolioManager - formData.logo_id set to:', media.id.toString());
    setOpenMediaSelector(false);
  };

  const getLogoById = (logoId) => {
    const logoMedia = media.find(m => m.id === logoId);
    return logoMedia ? `http://localhost:5001${logoMedia.file_path}` : null;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          Portfolio Manager
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          sx={{ 
            backgroundColor: '#f59e0b',
            '&:hover': { backgroundColor: '#d97706' }
          }}
        >
          Add Company
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Logo</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Sector</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Position</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Loading companies...</TableCell>
                </TableRow>
              ) : companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box textAlign="center" py={4}>
                      <BusinessIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No companies found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add your first portfolio company to get started
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id} hover>
                    <TableCell>
                      <Avatar
                        src={company.logo}
                        alt={company.logo_alt || company.name}
                        sx={{ width: 40, height: 40 }}
                      >
                        <BusinessIcon />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {company.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={company.sector || 'N/A'} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      {company.website ? (
                        <Tooltip title="Visit website">
                          <IconButton
                            size="small"
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <WebsiteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No website
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {company.description 
                          ? (company.description.length > 100 
                              ? `${company.description.substring(0, 100)}...` 
                              : company.description)
                          : 'No description'
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {company.position || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit company">
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(company)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete company">
                        <IconButton
                          size="small"
                          onClick={() => openDeleteDialog(company)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCompany ? 'Edit Company' : 'Add New Company'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Company Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Sector</InputLabel>
                  <Select
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    label="Sector"
                  >
                    {sectors.map((sector) => (
                      <MenuItem key={sector} value={sector}>
                        {sector}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="website"
                  label="Website"
                  value={formData.website}
                  onChange={handleInputChange}
                  fullWidth
                  margin="dense"
                  placeholder="https://example.com"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="position"
                  label="Display Position"
                  type="number"
                  value={formData.position}
                  onChange={handleInputChange}
                  fullWidth
                  margin="dense"
                  helperText="Lower numbers appear first"
                />
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                    Company Logo
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Button
                      variant="outlined"
                      startIcon={<ImageIcon />}
                      onClick={openImageSelector}
                      sx={{ 
                        borderColor: '#e2e8f0',
                        color: '#64748b',
                        '&:hover': { 
                          borderColor: '#f59e0b', 
                          backgroundColor: '#fef3c7' 
                        }
                      }}
                    >
                      {selectedLogo ? 'Change Logo' : 'Select Logo'}
                    </Button>
                    {selectedLogo && (
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={`http://localhost:5001${selectedLogo.file_path}`}
                          sx={{ width: 40, height: 40 }}
                        >
                          <ImageIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {selectedLogo.original_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selectedLogo.file_size ? `${(selectedLogo.file_size / 1024).toFixed(1)} KB` : ''}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedLogo(null);
                            setFormData(prev => ({ ...prev, logo_id: '' }));
                          }}
                          sx={{ color: '#ef4444' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ 
                backgroundColor: '#f59e0b',
                '&:hover': { backgroundColor: '#d97706' }
              }}
            >
              {editingCompany ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deletingCompany?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Selector Dialog */}
      <MediaSelector
        open={openMediaSelector}
        onClose={() => setOpenMediaSelector(false)}
        onSelect={handleImageSelect}
        title="Select Company Logo"
        category="portfolio"
      />
    </Box>
  );
}