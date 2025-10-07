import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Grid,
  Chip,
  Tooltip,
  Alert,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const FormSubmissions = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewDialog, setViewDialog] = useState({
    open: false,
    submission: null
  });
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchFormAndSubmissions();
  }, [formId, pagination.page, filters]);

  const fetchFormAndSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      // Fetch form details
      const formResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/forms/${formId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!formResponse.ok) {
        throw new Error('Failed to fetch form');
      }

      const formResult = await formResponse.json();
      if (formResult.success) {
        setForm(formResult.data);
      }

      // Fetch submissions
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status !== 'all' && { status: filters.status })
      });

      const submissionsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/forms/${formId}/submissions?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!submissionsResponse.ok) {
        throw new Error('Failed to fetch submissions');
      }

      const submissionsResult = await submissionsResponse.json();
      if (submissionsResult.success) {
        setSubmissions(submissionsResult.data);
        setPagination(prev => ({
          ...prev,
          total: submissionsResult.pagination.total,
          pages: submissionsResult.pagination.pages
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'primary';
      case 'read': return 'warning';
      case 'processed': return 'success';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const handleViewSubmission = (submission) => {
    setViewDialog({
      open: true,
      submission: submission
    });
  };

  const handleCloseViewDialog = () => {
    setViewDialog({
      open: false,
      submission: null
    });
  };

  const formatFieldValue = (field, value) => {
    if (!value) return '-';
    
    if (field.type === 'checkbox' && Array.isArray(value)) {
      return value.join(', ');
    }
    
    if (field.type === 'file') {
      return value.name || value;
    }
    
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    
    return value;
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
                Form Submissions
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {form?.name || 'Loading...'} • {pagination.total} submissions
              </Typography>
            </Box>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={fetchFormAndSubmissions}
              sx={{ 
                backgroundColor: 'white', 
                color: 'primary.main',
                '&:hover': { backgroundColor: 'grey.100' }
              }}
            >
              Refresh
            </Button>
            
            <Button
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              sx={{ minWidth: 120 }}
            >
              Export CSV
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

      {/* Filters and Search */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search submissions..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="read">Read</MenuItem>
                <MenuItem value="processed">Processed</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="From Date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="To Date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={1}>
            <Box display="flex" justifyContent="center">
              <Chip 
                label={`${pagination.total} total`} 
                color="primary" 
                variant="outlined" 
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Submissions Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Submitted</strong></TableCell>
                {form?.fields?.slice(0, 3).map(field => (
                  <TableCell key={field.id}>
                    <strong>{field.label}</strong>
                  </TableCell>
                ))}
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No submissions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((submission) => (
                  <TableRow key={submission.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        #{submission.id}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={submission.status} 
                        color={getStatusColor(submission.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(submission.submitted_at).toLocaleTimeString()}
                        </Typography>
                      </Stack>
                    </TableCell>
                    
                    {form?.fields?.slice(0, 3).map(field => (
                      <TableCell key={field.id}>
                        <Typography variant="body2" noWrap>
                          {formatFieldValue(field, submission.data[field.name])}
                        </Typography>
                      </TableCell>
                    ))}
                    
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewSubmission(submission)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={(event, newPage) => {
            setPagination(prev => ({ ...prev, page: newPage + 1 }));
          }}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={(event) => {
            setPagination(prev => ({ 
              ...prev, 
              limit: parseInt(event.target.value, 10),
              page: 1
            }));
          }}
        />
      </Paper>

      {/* View Submission Dialog */}
      <Dialog 
        open={viewDialog.open} 
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Submission Details #{viewDialog.submission?.id}
            </Typography>
            <Chip 
              label={viewDialog.submission?.status || 'new'} 
              color={getStatusColor(viewDialog.submission?.status)}
              size="small"
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {viewDialog.submission && (
            <Stack spacing={3}>
              {/* Submission Meta */}
              <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Submitted At
                    </Typography>
                    <Typography variant="body1">
                      {new Date(viewDialog.submission.submitted_at).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      IP Address
                    </Typography>
                    <Typography variant="body1" fontFamily="monospace">
                      {viewDialog.submission.ip_address}
                    </Typography>
                  </Grid>
                  {viewDialog.submission.user_agent && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        User Agent
                      </Typography>
                      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                        {viewDialog.submission.user_agent}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* Form Data */}
              <Typography variant="h6" gutterBottom>
                Form Data
              </Typography>
              
              {form?.fields?.map(field => {
                const value = viewDialog.submission.data[field.name];
                if (!value && value !== 0) return null;
                
                return (
                  <Box key={field.id}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {field.label}
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                      <Typography variant="body1">
                        {field.type === 'checkbox' && Array.isArray(value) 
                          ? value.join(', ')
                          : field.type === 'file' 
                            ? (value.name || value)
                            : value
                        }
                      </Typography>
                    </Paper>
                  </Box>
                );
              })}
            </Stack>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>
            Close
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              // TODO: Mark as read functionality
              handleCloseViewDialog();
            }}
          >
            Mark as Read
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FormSubmissions;