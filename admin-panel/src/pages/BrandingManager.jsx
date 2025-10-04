import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Chip
} from '@mui/material';
import { Add, Edit, Delete, Save, Image as ImageIcon, Link as LinkIcon } from '@mui/icons-material';
import { useBranding, useBrandingManager, useFooterLinks, useFooterLinksManager } from '../hooks/useBranding';
import MediaSelector from '../components/MediaSelector';

const BrandingManager = () => {
  const { branding, loading: brandingLoading, error: brandingError, refetch: refetchBranding } = useBranding();
  const { footerLinks, loading: linksLoading, error: linksError, refetch: refetchLinks } = useFooterLinks();
  const { updateBrandingSetting, loading: updateLoading } = useBrandingManager();
  const { createFooterLink, updateFooterLink, deleteFooterLink, loading: linkActionLoading } = useFooterLinksManager();

  // Local state for form data
  const [editingSettings, setEditingSettings] = useState({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Footer link dialog state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [linkForm, setLinkForm] = useState({
    label: '',
    url: '',
    is_external: false,
    position: 0
  });

  // Media selector state
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [currentSettingKey, setCurrentSettingKey] = useState('');

  useEffect(() => {
    if (branding) {
      const initialSettings = {};
      Object.keys(branding).forEach(key => {
        initialSettings[key] = branding[key]?.value || '';
      });
      setEditingSettings(initialSettings);
    }
  }, [branding]);

  const handleSettingChange = (key, value) => {
    setEditingSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSetting = async (key) => {
    try {
      const value = editingSettings[key];
      const media_id = branding[key]?.media_id;
      
      await updateBrandingSetting(key, value, media_id);
      setSnackbarMessage(`Updated ${key.replace('_', ' ')} successfully`);
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      refetchBranding();
    } catch (error) {
      setSnackbarMessage(`Failed to update ${key}: ${error.message}`);
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };

  const handleMediaSelect = async (media) => {
    try {
      const currentValue = editingSettings[currentSettingKey] || '';
      await updateBrandingSetting(currentSettingKey, currentValue, media.id);
      setSnackbarMessage(`Updated ${currentSettingKey.replace('_', ' ')} image successfully`);
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      setMediaDialogOpen(false);
      refetchBranding();
    } catch (error) {
      setSnackbarMessage(`Failed to update image: ${error.message}`);
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };

  const openMediaSelector = (settingKey) => {
    setCurrentSettingKey(settingKey);
    setMediaDialogOpen(true);
  };

  // Footer link management
  const openLinkDialog = (link = null) => {
    if (link) {
      setEditingLink(link);
      setLinkForm({
        label: link.label,
        url: link.url,
        is_external: link.is_external,
        position: link.position
      });
    } else {
      setEditingLink(null);
      setLinkForm({
        label: '',
        url: '',
        is_external: false,
        position: Math.max(...footerLinks.map(l => l.position), 0) + 1
      });
    }
    setLinkDialogOpen(true);
  };

  const handleSaveLink = async () => {
    try {
      if (editingLink) {
        await updateFooterLink(editingLink.id, linkForm);
        setSnackbarMessage('Footer link updated successfully');
      } else {
        await createFooterLink(linkForm);
        setSnackbarMessage('Footer link created successfully');
      }
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      setLinkDialogOpen(false);
      refetchLinks();
    } catch (error) {
      setSnackbarMessage(`Failed to save footer link: ${error.message}`);
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (window.confirm('Are you sure you want to delete this footer link?')) {
      try {
        await deleteFooterLink(linkId);
        setSnackbarMessage('Footer link deleted successfully');
        setSnackbarSeverity('success');
        setShowSnackbar(true);
        refetchLinks();
      } catch (error) {
        setSnackbarMessage(`Failed to delete footer link: ${error.message}`);
        setSnackbarSeverity('error');
        setShowSnackbar(true);
      }
    }
  };

  if (brandingLoading || linksLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const brandingFields = [
    { key: 'company_name', label: 'Company Name', type: 'text' },
    { key: 'footer_tagline', label: 'Footer Tagline', type: 'text' },
    { key: 'footer_description', label: 'Footer Description', type: 'multiline' },
    { key: 'footer_copyright', label: 'Copyright Text', type: 'text' },
    { key: 'contact_address', label: 'Contact Address', type: 'text' },
    { key: 'contact_email', label: 'Contact Email', type: 'email' },
    { key: 'contact_phone', label: 'Primary Phone', type: 'text' },
    { key: 'contact_phone_secondary', label: 'Secondary Phone', type: 'text' },
    { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
    { key: 'logo_alt_text', label: 'Logo Alt Text', type: 'text', hasMedia: true }
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Branding & Footer Management
      </Typography>

      {/* Branding Settings */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Branding Settings
          </Typography>
          
          <Grid container spacing={3}>
            {brandingFields.map((field) => (
              <Grid item xs={12} md={6} key={field.key}>
                <Box>
                  <TextField
                    fullWidth
                    label={field.label}
                    type={field.type === 'email' || field.type === 'url' ? field.type : 'text'}
                    multiline={field.type === 'multiline'}
                    rows={field.type === 'multiline' ? 4 : 1}
                    value={editingSettings[field.key] || ''}
                    onChange={(e) => handleSettingChange(field.key, e.target.value)}
                    margin="normal"
                  />
                  
                  <Box display="flex" gap={1} mt={1}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={() => handleSaveSetting(field.key)}
                      disabled={updateLoading}
                      size="small"
                    >
                      Save
                    </Button>
                    
                    {field.hasMedia && (
                      <Button
                        variant="outlined"
                        startIcon={<ImageIcon />}
                        onClick={() => openMediaSelector(field.key)}
                        size="small"
                      >
                        {branding[field.key]?.media_path ? 'Change Logo' : 'Select Logo'}
                      </Button>
                    )}
                  </Box>
                  
                  {field.hasMedia && branding[field.key]?.media_path && (
                    <Box mt={1}>
                      <Chip 
                        label={`Current: ${branding[field.key].media_path.split('/').pop()}`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">
              Footer Quick Links
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openLinkDialog()}
            >
              Add Link
            </Button>
          </Box>

          <Grid container spacing={2}>
            {footerLinks.map((link) => (
              <Grid item xs={12} sm={6} md={4} key={link.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {link.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {link.url}
                    </Typography>
                    <Box display="flex" gap={1} mt={1}>
                      {link.is_external && (
                        <Chip label="External" size="small" color="info" />
                      )}
                      <Chip label={`Position: ${link.position}`} size="small" />
                    </Box>
                    <Box display="flex" gap={1} mt={2}>
                      <IconButton 
                        size="small" 
                        onClick={() => openLinkDialog(link)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteLink(link.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Footer Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingLink ? 'Edit Footer Link' : 'Add Footer Link'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Label"
            value={linkForm.label}
            onChange={(e) => setLinkForm(prev => ({ ...prev, label: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="URL"
            value={linkForm.url}
            onChange={(e) => setLinkForm(prev => ({ ...prev, url: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Position"
            type="number"
            value={linkForm.position}
            onChange={(e) => setLinkForm(prev => ({ ...prev, position: parseInt(e.target.value) }))}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={linkForm.is_external}
                onChange={(e) => setLinkForm(prev => ({ ...prev, is_external: e.target.checked }))}
              />
            }
            label="External Link"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveLink} variant="contained" disabled={linkActionLoading}>
            {linkActionLoading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Selector Dialog */}
      <MediaSelector
        open={mediaDialogOpen}
        onClose={() => setMediaDialogOpen(false)}
        onSelect={handleMediaSelect}
        category="brand"
        title="Select Brand Logo"
      />

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert severity={snackbarSeverity} onClose={() => setShowSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BrandingManager;