import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Alert,
  Grid,
  Chip,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import MediaSelector from '../components/MediaSelector';

const TeamManager = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openMediaSelector, setOpenMediaSelector] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    experience: '',
    education: '',
    linkedin_url: '',
    emailID: '',
    image_id: '',
    position: 0
  });

  useEffect(() => {
    fetchTeamMembers();
    fetchMedia();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/team', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('TeamManager - fetchTeamMembers response:', data);
        setTeamMembers(data);
        setError('');
      } else {
        setError('Failed to fetch team members');
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    try {
      console.log('TeamManager - fetchMedia called');
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/media-usage', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('TeamManager - fetchMedia response:', data);
        setMedia(data.media || []);
      } else {
        console.error('TeamManager - fetchMedia failed:', response.status);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openCreateDialog = () => {
    setFormData({
      name: '',
      title: '',
      experience: '',
      education: '',
      linkedin_url: '',
      emailID: '',
      image_id: '',
      position: teamMembers.length
    });
    setSelectedMember(null);
    setSelectedImage(null);
    setOpenDialog(true);
  };

  const openEditDialog = (member) => {
    console.log('TeamManager - openEditDialog called with member:', member);
    console.log('TeamManager - current media array:', media);
    
    setFormData({
      name: member.name || '',
      title: member.title || '',
      experience: member.experience || '',
      education: member.education || '',
      linkedin_url: member.linkedin_url || '',
      emailID: member.emailID || '',
      image_id: member.image_id || '',
      position: member.position || 0
    });
    
    // Set selected image for the media selector
    if (member.image_id) {
      console.log('TeamManager - looking for image_id:', member.image_id, 'type:', typeof member.image_id);
      console.log('TeamManager - media array length:', media.length);
      console.log('TeamManager - media IDs:', media.map(m => ({ id: m.id, type: typeof m.id, filename: m.filename })));
      const mediaItem = media.find(m => m.id == member.image_id); // Use == for type coercion
      console.log('TeamManager - found mediaItem:', mediaItem);
      setSelectedImage(mediaItem || null);
    } else {
      console.log('TeamManager - no image_id on member');
      setSelectedImage(null);
    }
    setSelectedMember(member);
    setOpenDialog(true);
  };

  const openView = (member) => {
    setSelectedMember(member);
    setOpenViewDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setOpenViewDialog(false);
    setOpenMediaSelector(false);
    setSelectedMember(null);
    setSelectedImage(null);
    setFormData({
      name: '',
      title: '',
      experience: '',
      education: '',
      linkedin_url: '',
      emailID: '',
      image_id: '',
      position: 0
    });
  };

  const handleImageSelect = (mediaItem) => {
    if (mediaItem) {
      setSelectedImage(mediaItem);
      setFormData(prev => ({
        ...prev,
        image_id: mediaItem.id
      }));
    } else {
      // Clear image
      setSelectedImage(null);
      setFormData(prev => ({
        ...prev,
        image_id: ''
      }));
    }
    setOpenMediaSelector(false);
  };

  const openImageSelector = () => {
    setOpenMediaSelector(true);
  };

  const cleanFormData = (data) => {
    return {
      ...data,
      image_id: data.image_id === '' ? null : parseInt(data.image_id) || null,
      position: parseInt(data.position) || 0,
      linkedin_url: data.linkedin_url || null,
      emailID: data.emailID || null,
      education: data.education || null
    };
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const cleanedData = cleanFormData(formData);
      
      console.log('Submitting team member data:', cleanedData);

      const url = selectedMember 
        ? `http://localhost:5001/api/team/${selectedMember.id}`
        : 'http://localhost:5001/api/team';
      
      const method = selectedMember ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanedData)
      });

      const responseData = await response.json();
      console.log('API response:', responseData);

      if (response.ok) {
        setSuccess(selectedMember ? 'Team member updated successfully!' : 'Team member created successfully!');
        setError('');
        closeDialog();
        fetchTeamMembers();
      } else {
        console.error('API error response:', response.status, responseData);
        setError(responseData.message || `Failed to ${selectedMember ? 'update' : 'create'} team member`);
      }
    } catch (err) {
      console.error('Error submitting team member:', err);
      setError(`Failed to ${selectedMember ? 'update' : 'create'} team member`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5001/api/team/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Team member deleted successfully!');
        setError('');
        fetchTeamMembers();
      } else {
        setError('Failed to delete team member');
      }
    } catch (err) {
      console.error('Error deleting team member:', err);
      setError('Failed to delete team member');
    }
  };

  const getRoleColor = (title) => {
    if (title?.toLowerCase().includes('managing')) return 'primary';
    if (title?.toLowerCase().includes('partner')) return 'secondary';
    if (title?.toLowerCase().includes('director')) return 'warning';
    return 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading team members...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Team Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
        >
          Add Team Member
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>LinkedIn</TableCell>
              <TableCell>Position</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={member.image} alt={member.name}>
                      {member.name?.charAt(0)}
                    </Avatar>
                    <Typography variant="body1" fontWeight="medium">
                      {member.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={member.title?.split(',')[0] || 'No Title'} 
                    color={getRoleColor(member.title)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {member.emailID ? (
                    <Typography variant="body2" color="primary">
                      {member.emailID}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not provided
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {member.linkedin_url ? (
                    <Typography variant="body2" color="primary">
                      ✓ Available
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not provided
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{member.position || 0}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openView(member)} size="small">
                    <ViewIcon />
                  </IconButton>
                  <IconButton onClick={() => openEditDialog(member)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(member.id)} 
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedMember ? 'Edit Team Member' : 'Add New Team Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="emailID"
                label="Email Address"
                type="email"
                value={formData.emailID}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Title & Position"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                required
                placeholder="e.g., Managing Partner, 7Boson"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="experience"
                label="Experience & Background"
                value={formData.experience}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Professional experience and background..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="education"
                label="Education"
                value={formData.education}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
                placeholder="Educational background and qualifications..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="linkedin_url"
                label="LinkedIn URL"
                value={formData.linkedin_url}
                onChange={handleInputChange}
                fullWidth
                placeholder="https://www.linkedin.com/in/..."
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
                helperText="Order in which member appears (0 = first)"
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Profile Image
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {selectedImage ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={selectedImage.file_path ? `http://localhost:5001${selectedImage.file_path}` : ''}
                        alt="Selected image"
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {selectedImage.filename || `Image ID: ${selectedImage.id}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedImage.alt_text}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 60, height: 60, bgcolor: 'grey.300' }}>
                        <ImageIcon />
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        No image selected
                      </Typography>
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<ImageIcon />}
                    onClick={openImageSelector}
                  >
                    {selectedImage ? 'Change Image' : 'Select Image'}
                  </Button>
                  {selectedImage && (
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => handleImageSelect(null)}
                      size="small"
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedMember ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>Team Member Details</DialogTitle>
        <DialogContent>
          {selectedMember && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Avatar 
                    src={selectedMember.image} 
                    alt={selectedMember.name}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  >
                    {selectedMember.name?.charAt(0)}
                  </Avatar>
                  <Typography variant="h6">{selectedMember.name}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {selectedMember.title}
                  </Typography>
                  {selectedMember.emailID && (
                    <Typography variant="body2" color="primary">
                      📧 {selectedMember.emailID}
                    </Typography>
                  )}
                  {selectedMember.linkedin_url && (
                    <Typography variant="body2" color="primary">
                      🔗 LinkedIn Profile
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6" gutterBottom>Experience</Typography>
                  <Typography variant="body2" paragraph>
                    {selectedMember.experience || 'No experience information provided.'}
                  </Typography>
                  
                  {selectedMember.education && (
                    <>
                      <Typography variant="h6" gutterBottom>Education</Typography>
                      <Typography variant="body2" paragraph>
                        {selectedMember.education}
                      </Typography>
                    </>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
          {selectedMember && (
            <Button onClick={() => openEditDialog(selectedMember)} variant="contained">
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Media Selector Dialog */}
      <MediaSelector
        open={openMediaSelector}
        onClose={() => setOpenMediaSelector(false)}
        onSelect={handleImageSelect}
        selectedImageId={selectedImage?.id}
        category="team"
        title="Select Team Member Image"
      />
    </Box>
  );
};

export default TeamManager;