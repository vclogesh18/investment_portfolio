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
  Card,
  CardContent,
  Chip,
  Avatar,
  Tooltip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
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
  Menu
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  DeleteOutline as DeleteIcon
} from '@mui/icons-material';

const FormSubmissions = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
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

  const updateSubmissionStatus = async (submissionId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/forms/submissions/${submissionId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update submission status');
      }

      const result = await response.json();
      if (result.success) {
        setSubmissions(prev => 
          prev.map(sub => 
            sub.id === submissionId ? { ...sub, status } : sub
          )
        );
        
        if (selectedSubmission && selectedSubmission.id === submissionId) {
          setSelectedSubmission(prev => ({ ...prev, status }));
        }
      }
    } catch (error) {
      console.error('Error updating submission status:', error);
      setError(error.message);
    }
  };

  const exportSubmissions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/forms/${formId}/submissions?export=csv`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to export submissions');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${form?.slug || 'form'}-submissions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting submissions:', error);
      setError(error.message);
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
        <Box display="flex" alignItems="center" justifyContent="between">
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
                {form?.name || 'Loading...'}
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
              onClick={exportSubmissions}
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
            onClick={() => navigate('/forms')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Form Submissions</h1>
            <p className="text-gray-600 mt-1">
              {form?.name} • {pagination.total} submissions
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchFormAndSubmissions}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          
          <button
            onClick={exportSubmissions}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="processed">Processed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search submissions..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-500">No one has submitted this form yet.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Preview
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User size={16} className="text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              #{submission.id}
                            </div>
                            {submission.ip_address && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Globe size={12} className="mr-1" />
                                {submission.ip_address}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={submission.status}
                          onChange={(e) => updateSubmissionStatus(submission.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(submission.status)}`}
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="processed">Processed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-1 max-w-xs">
                          {Object.entries(submission.data).slice(0, 3).map(([key, value]) => {
                            const field = form?.fields?.find(f => f.name === key);
                            return (
                              <div key={key} className="text-sm">
                                <span className="font-medium text-gray-600">{field?.label || key}:</span>{' '}
                                <span className="text-gray-900">{formatFieldValue(field, value)}</span>
                              </div>
                            );
                          })}
                          {Object.keys(submission.data).length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{Object.keys(submission.data).length - 3} more fields
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(submission.submitted_at).toLocaleTimeString()}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.pages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">{pagination.total}</span>{' '}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setPagination(prev => ({ ...prev, page }))}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          form={form}
          onClose={() => setSelectedSubmission(null)}
          onStatusUpdate={(status) => updateSubmissionStatus(selectedSubmission.id, status)}
        />
      )}
    </div>
  );
};

// Submission Detail Modal
const SubmissionDetailModal = ({ submission, form, onClose, onStatusUpdate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Submission #{submission.id}
            </h3>
            <p className="text-gray-600 mt-1">
              Submitted on {new Date(submission.submitted_at).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={submission.status}
              onChange={(e) => onStatusUpdate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="processed">Processed</option>
              <option value="archived">Archived</option>
            </select>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submission Data */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Submitted Data</h4>
            <div className="space-y-4">
              {Object.entries(submission.data).map(([key, value]) => {
                const field = form?.fields?.find(f => f.name === key);
                return (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field?.label || key}
                      {field?.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    <div className="bg-gray-50 p-3 rounded border">
                      {field?.type === 'textarea' ? (
                        <div className="whitespace-pre-wrap text-sm text-gray-900">{value || '-'}</div>
                      ) : field?.type === 'checkbox' && Array.isArray(value) ? (
                        <div className="text-sm text-gray-900">{value.join(', ') || '-'}</div>
                      ) : field?.type === 'file' ? (
                        <div className="text-sm text-gray-900">{value?.name || value || '-'}</div>
                      ) : (
                        <div className="text-sm text-gray-900">{value || '-'}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metadata */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Submission Details</h4>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Technical Information</h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">IP Address:</span>
                    <div className="text-gray-900">{submission.ip_address || 'Unknown'}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">User Agent:</span>
                    <div className="text-gray-900 text-xs break-all">
                      {submission.user_agent || 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Submitted:</span>
                    <div className="text-gray-900">
                      {new Date(submission.submitted_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Form Information</h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Form:</span>
                    <div className="text-gray-900">{form?.name}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Slug:</span>
                    <div className="text-gray-900">/{form?.slug}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSubmissions;