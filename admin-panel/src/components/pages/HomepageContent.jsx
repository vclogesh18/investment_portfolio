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
} from '@mui/material';
import {
  ExpandMore,
  Save,
  Refresh,
  Add,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE = 'http://localhost:5001/api';

export default function HomepageContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  
  // Homepage content state
  const [homepageData, setHomepageData] = useState({
    hero: null,
    sections: [],
    quotes: [],
    cta: []
  });

  // Form states for editing
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    background_image_url: '',
    primary_cta_text: '',
    primary_cta_link: '',
    secondary_cta_text: '',
    secondary_cta_link: '',
    is_active: true
  });

  const [quotesForm, setQuotesForm] = useState([]);
  const [sectionsForm, setSectionsForm] = useState([]);
  const [ctaForm, setCtaForm] = useState([]);

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 5000);
  };

  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/homepage`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch homepage data');
      }

      const data = await response.json();
      setHomepageData(data);

      // Initialize forms with fetched data
      if (data.hero) {
        setHeroForm({
          title: data.hero.title || '',
          subtitle: data.hero.subtitle || '',
          description: data.hero.description || '',
          background_image_url: data.hero.background_image_url || '',
          primary_cta_text: data.hero.primary_cta_text || '',
          primary_cta_link: data.hero.primary_cta_link || '',
          secondary_cta_text: data.hero.secondary_cta_text || '',
          secondary_cta_link: data.hero.secondary_cta_link || '',
          is_active: data.hero.is_active ?? true
        });
      }

      setQuotesForm(data.quotes || []);
      setSectionsForm(data.sections || []);
      setCtaForm(data.cta || []);

    } catch (error) {
      console.error('Error fetching homepage data:', error);
      showAlert('Failed to load homepage data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveHeroSection = async () => {
    try {
      setSaving(true);
      
      const method = homepageData.hero ? 'PUT' : 'POST';
      const url = homepageData.hero 
        ? `${API_BASE}/homepage/hero/${homepageData.hero.id}`
        : `${API_BASE}/homepage/hero`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...heroForm,
          page_slug: 'home',
          position: 0
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save hero section');
      }

      showAlert('Hero section saved successfully!');
      fetchHomepageData(); // Refresh data
    } catch (error) {
      console.error('Error saving hero section:', error);
      showAlert('Failed to save hero section', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveQuote = async (index, quote) => {
    try {
      setSaving(true);
      
      const method = quote.id ? 'PUT' : 'POST';
      const url = quote.id 
        ? `${API_BASE}/homepage/quotes/${quote.id}`
        : `${API_BASE}/homepage/quotes`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...quote,
          page_slug: 'home',
          section_position: index + 1
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save quote');
      }

      showAlert('Quote saved successfully!');
      fetchHomepageData(); // Refresh data
    } catch (error) {
      console.error('Error saving quote:', error);
      showAlert('Failed to save quote', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveSection = async (index, section) => {
    try {
      setSaving(true);
      
      const method = section.id ? 'PUT' : 'POST';
      const url = section.id 
        ? `${API_BASE}/homepage/sections/${section.id}`
        : `${API_BASE}/homepage/sections`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...section,
          page_slug: 'home',
          position: index + 1
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save section');
      }

      showAlert('Section saved successfully!');
      fetchHomepageData(); // Refresh data
    } catch (error) {
      console.error('Error saving section:', error);
      showAlert('Failed to save section', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveCTA = async (index, cta) => {
    try {
      setSaving(true);
      
      const method = cta.id ? 'PUT' : 'POST';
      const url = cta.id 
        ? `${API_BASE}/homepage/cta/${cta.id}`
        : `${API_BASE}/homepage/cta`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...cta,
          page_slug: 'home',
          position: index + 1
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save CTA');
      }

      showAlert('CTA section saved successfully!');
      fetchHomepageData(); // Refresh data
    } catch (error) {
      console.error('Error saving CTA:', error);
      showAlert('Failed to save CTA', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateQuoteForm = (index, field, value) => {
    const updated = [...quotesForm];
    updated[index] = { ...updated[index], [field]: value };
    setQuotesForm(updated);
  };

  const updateSectionForm = (index, field, value) => {
    const updated = [...sectionsForm];
    updated[index] = { ...updated[index], [field]: value };
    setSectionsForm(updated);
  };

  const updateCTAForm = (index, field, value) => {
    const updated = [...ctaForm];
    updated[index] = { ...updated[index], [field]: value };
    setCtaForm(updated);
  };

  const addNewQuote = () => {
    setQuotesForm([...quotesForm, {
      quote_text: '',
      author: '',
      author_title: '',
      author_image_url: '',
      is_active: true
    }]);
  };

  const addNewCTA = () => {
    setCtaForm([...ctaForm, {
      title: '',
      description: '',
      primary_button_text: '',
      primary_button_link: '',
      secondary_button_text: '',
      secondary_button_link: '',
      background_color: '',
      text_color: '',
      is_active: true
    }]);
  };

  useEffect(() => {
    fetchHomepageData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading homepage content...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          Homepage Content
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchHomepageData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      {/* Hero Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Hero Section</Typography>
          <Chip 
            label={homepageData.hero ? 'Active' : 'Not Set'} 
            color={homepageData.hero ? 'success' : 'default'} 
            size="small" 
            sx={{ ml: 2 }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
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
                label="Subtitle (optional)"
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
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Background Image URL"
                value={heroForm.background_image_url}
                onChange={(e) => setHeroForm({ ...heroForm, background_image_url: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Primary Button Text"
                value={heroForm.primary_cta_text}
                onChange={(e) => setHeroForm({ ...heroForm, primary_cta_text: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Primary Button Link"
                value={heroForm.primary_cta_link}
                onChange={(e) => setHeroForm({ ...heroForm, primary_cta_link: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Secondary Button Text"
                value={heroForm.secondary_cta_text}
                onChange={(e) => setHeroForm({ ...heroForm, secondary_cta_text: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Secondary Button Link"
                value={heroForm.secondary_cta_link}
                onChange={(e) => setHeroForm({ ...heroForm, secondary_cta_link: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={heroForm.is_active}
                    onChange={(e) => setHeroForm({ ...heroForm, is_active: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={saveHeroSection}
                disabled={saving}
                sx={{ mt: 2 }}
              >
                Save Hero Section
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Page Sections */}
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Page Sections</Typography>
          <Chip 
            label={`${sectionsForm.length} sections`} 
            color="primary" 
            size="small" 
            sx={{ ml: 2 }}
          />
        </AccordionSummary>
        <AccordionDetails>
          {sectionsForm.map((section, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Section {index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={section.title || ''}
                    onChange={(e) => updateSectionForm(index, 'title', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Section Type"
                    value={section.section_type || ''}
                    onChange={(e) => updateSectionForm(index, 'section_type', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={section.description || ''}
                    onChange={(e) => updateSectionForm(index, 'description', e.target.value)}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={section.is_active ?? true}
                        onChange={(e) => updateSectionForm(index, 'is_active', e.target.checked)}
                      />
                    }
                    label="Active"
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Save />}
                    onClick={() => saveSection(index, section)}
                    disabled={saving}
                    sx={{ ml: 2 }}
                  >
                    Save Section
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Quotes */}
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Quotes</Typography>
          <Chip 
            label={`${quotesForm.length} quotes`} 
            color="secondary" 
            size="small" 
            sx={{ ml: 2 }}
          />
        </AccordionSummary>
        <AccordionDetails>
          {quotesForm.map((quote, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Quote {index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Quote Text"
                    value={quote.quote_text || ''}
                    onChange={(e) => updateQuoteForm(index, 'quote_text', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Author (optional)"
                    value={quote.author || ''}
                    onChange={(e) => updateQuoteForm(index, 'author', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Author Title (optional)"
                    value={quote.author_title || ''}
                    onChange={(e) => updateQuoteForm(index, 'author_title', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={quote.is_active ?? true}
                        onChange={(e) => updateQuoteForm(index, 'is_active', e.target.checked)}
                      />
                    }
                    label="Active"
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Save />}
                    onClick={() => saveQuote(index, quote)}
                    disabled={saving}
                    sx={{ ml: 2 }}
                  >
                    Save Quote
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addNewQuote}
            sx={{ mt: 2 }}
          >
            Add New Quote
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* CTA Sections */}
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Call-to-Action Sections</Typography>
          <Chip 
            label={`${ctaForm.length} CTAs`} 
            color="warning" 
            size="small" 
            sx={{ ml: 2 }}
          />
        </AccordionSummary>
        <AccordionDetails>
          {ctaForm.map((cta, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                CTA {index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={cta.title || ''}
                    onChange={(e) => updateCTAForm(index, 'title', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={cta.description || ''}
                    onChange={(e) => updateCTAForm(index, 'description', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Primary Button Text"
                    value={cta.primary_button_text || ''}
                    onChange={(e) => updateCTAForm(index, 'primary_button_text', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Primary Button Link"
                    value={cta.primary_button_link || ''}
                    onChange={(e) => updateCTAForm(index, 'primary_button_link', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Secondary Button Text (optional)"
                    value={cta.secondary_button_text || ''}
                    onChange={(e) => updateCTAForm(index, 'secondary_button_text', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Secondary Button Link (optional)"
                    value={cta.secondary_button_link || ''}
                    onChange={(e) => updateCTAForm(index, 'secondary_button_link', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={cta.is_active ?? true}
                        onChange={(e) => updateCTAForm(index, 'is_active', e.target.checked)}
                      />
                    }
                    label="Active"
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Save />}
                    onClick={() => saveCTA(index, cta)}
                    disabled={saving}
                    sx={{ ml: 2 }}
                  >
                    Save CTA
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addNewCTA}
            sx={{ mt: 2 }}
          >
            Add New CTA
          </Button>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}