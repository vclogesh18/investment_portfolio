import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Grid,
  Chip,
  Avatar,
  Tooltip,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Switch,
  FormControlLabel,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Divider,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Launch as LaunchIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const FormsManager = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forms`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch forms');
      }

      const result = await response.json();
      if (result.success) {
        setForms(result.data);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFormStatus = async (formId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forms/${formId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update form status');
      }

      const result = await response.json();
      if (result.success) {
        setForms(forms.map(form => 
          form.id === formId ? { ...form, active: !currentStatus } : form
        ));
      }
    } catch (error) {
      console.error('Error updating form status:', error);
      setError(error.message);
    }
  };

  const deleteForm = async (formId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forms/${formId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete form');
      }

      setForms(forms.filter(form => form.id !== formId));
      setDeleteDialogOpen(false);
      setFormToDelete(null);
    } catch (error) {
      console.error('Error deleting form:', error);
      setError(error.message);
    }
  };

  const handleDeleteClick = (form) => {
    setFormToDelete(form);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Forms Manager
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Create and manage dynamic forms for your website
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/forms/new')}
            sx={{ 
              backgroundColor: 'white', 
              color: 'primary.main',
              '&:hover': { backgroundColor: 'grey.100' }
            }}
          >
            Create New Form
          </Button>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
          <AssignmentIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="text.secondary">
            No forms found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Get started by creating your first dynamic form.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/forms/new')}
          >
            Create Your First Form
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {forms.map((form) => (
            <Grid item xs={12} sm={6} lg={4} key={form.id}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  {/* Form Header */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flexGrow={1}>
                      <Typography variant="h6" component="h3" fontWeight="bold" noWrap>
                        {form.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        /{form.slug}
                      </Typography>
                      {form.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {form.description}
                        </Typography>
                      )}
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.active}
                          onChange={() => toggleFormStatus(form.id, form.active)}
                          color="primary"
                          size="small"
                        />
                      }
                      label=""
                      sx={{ ml: 1 }}
                    />
                  </Box>

                  {/* Status Badge */}
                  <Box mb={2}>
                    <Chip
                      label={form.active ? 'Active' : 'Inactive'}
                      color={form.active ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {/* Stats */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
                        <AssignmentIcon sx={{ fontSize: 20, mb: 0.5 }} />
                        <Typography variant="h6" fontWeight="bold">
                          {form.field_count || 0}
                        </Typography>
                        <Typography variant="caption">
                          Fields
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', backgroundColor: 'success.light', color: 'success.contrastText' }}>
                        <PeopleIcon sx={{ fontSize: 20, mb: 0.5 }} />
                        <Typography variant="h6" fontWeight="bold">
                          {form.submission_count || 0}
                        </Typography>
                        <Typography variant="caption">
                          Submissions
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Creation Date */}
                  <Typography variant="caption" color="text.secondary">
                    Created {new Date(form.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>

                <Divider />

                <CardActions sx={{ p: 2, pt: 1 }}>
                  <Stack direction="row" spacing={1} width="100%">
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/forms/${form.id}/edit`)}
                      variant="outlined"
                      color="primary"
                      sx={{ flex: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<TrendingUpIcon />}
                      onClick={() => navigate(`/forms/${form.id}/submissions`)}
                      variant="outlined"
                      color="success"
                      sx={{ flex: 1 }}
                    >
                      Submissions
                    </Button>
                    <Tooltip title="Preview form">
                      <IconButton
                        size="small"
                        onClick={() => window.open(`${import.meta.env.VITE_FRONTEND_URL}/${form.slug === 'contact' ? 'contact' : 'apply'}`, '_blank')}
                        color="info"
                      >
                        <LaunchIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete form">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(form)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add form"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => navigate('/forms/new')}
      >
        <AddIcon />
      </Fab>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Form
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the form "{formToDelete?.name}"? 
            This action cannot be undone and will also delete all associated submissions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => deleteForm(formToDelete?.id)} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FormsManager;