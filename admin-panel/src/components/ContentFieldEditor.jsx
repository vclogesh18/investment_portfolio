import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add,
  Delete,
  ExpandMore,
  DragIndicator,
} from '@mui/icons-material';

// Helper component for editing array items like office locations, team members, etc.
const ArrayItemEditor = ({ items = [], onUpdate, itemTemplate, itemRenderer }) => {
  const [editingItems, setEditingItems] = useState(items);

  useEffect(() => {
    setEditingItems(items);
  }, [items]);

  const addItem = () => {
    const newItems = [...editingItems, { ...itemTemplate, id: Date.now() }];
    setEditingItems(newItems);
    onUpdate(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...editingItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditingItems(newItems);
    onUpdate(newItems);
  };

  const deleteItem = (index) => {
    const newItems = editingItems.filter((_, i) => i !== index);
    setEditingItems(newItems);
    onUpdate(newItems);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Items ({editingItems.length})</Typography>
        <Button onClick={addItem} startIcon={<Add />} variant="outlined" size="small">
          Add Item
        </Button>
      </Box>
      
      {editingItems.map((item, index) => (
        <Accordion key={item.id || index} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <DragIndicator sx={{ mr: 1 }} />
              <Typography>
                {itemRenderer ? itemRenderer(item, index) : `Item ${index + 1}`}
              </Typography>
              <Box sx={{ ml: 'auto', mr: 2 }}>
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(index);
                  }}
                  size="small"
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {Object.entries(itemTemplate).map(([field, defaultValue]) => (
                <Grid item xs={12} md={6} key={field}>
                  <TextField
                    fullWidth
                    label={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    value={item[field] || ''}
                    onChange={(e) => updateItem(index, field, e.target.value)}
                    multiline={field === 'description' || field === 'content'}
                    rows={field === 'description' || field === 'content' ? 3 : 1}
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

// Main content field editor component
export default function ContentFieldEditor({ contentType, content, onChange }) {
  const [formData, setFormData] = useState(content || {});

  useEffect(() => {
    setFormData(content || {});
  }, [content]);

  const updateFormData = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const renderContactInfoForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Contact Information</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.phone || ''}
          onChange={(e) => updateFormData('phone', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email"
          value={formData.email || ''}
          onChange={(e) => updateFormData('email', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          value={formData.address || ''}
          onChange={(e) => updateFormData('address', e.target.value)}
          multiline
          rows={2}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Business Hours"
          value={formData.business_hours || ''}
          onChange={(e) => updateFormData('business_hours', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Response Time"
          value={formData.response_time || ''}
          onChange={(e) => updateFormData('response_time', e.target.value)}
        />
      </Grid>
    </Grid>
  );

  const renderOfficeLocationsForm = () => {
    const officeTemplate = {
      city: '',
      address: '',
      phone: '',
      email: '',
      country: '',
      timezone: ''
    };

    return (
      <ArrayItemEditor
        items={formData.offices || []}
        onUpdate={(offices) => updateFormData('offices', offices)}
        itemTemplate={officeTemplate}
        itemRenderer={(office) => office.city || 'New Office'}
      />
    );
  };

  const renderFormConfigForm = () => {
    const optionTemplate = {
      value: '',
      label: ''
    };

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Form Configuration</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Form Action URL"
            value={formData.action_url || ''}
            onChange={(e) => updateFormData('action_url', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Success Message"
            value={formData.success_message || ''}
            onChange={(e) => updateFormData('success_message', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <ArrayItemEditor
            items={formData.options || []}
            onUpdate={(options) => updateFormData('options', options)}
            itemTemplate={optionTemplate}
            itemRenderer={(option) => `${option.value}: ${option.label}` || 'New Option'}
          />
        </Grid>
      </Grid>
    );
  };

  const renderFeatureListForm = () => {
    const featureTemplate = {
      title: '',
      description: '',
      icon: '',
      link_url: '',
      link_text: ''
    };

    return (
      <ArrayItemEditor
        items={formData.features || []}
        onUpdate={(features) => updateFormData('features', features)}
        itemTemplate={featureTemplate}
        itemRenderer={(feature) => feature.title || 'New Feature'}
      />
    );
  };

  const renderInvestmentAreasForm = () => {
    const areaTemplate = {
      title: '',
      description: '',
      icon: '',
      category: '',
      performance: '',
      risk_level: ''
    };

    return (
      <ArrayItemEditor
        items={formData.areas || []}
        onUpdate={(areas) => updateFormData('areas', areas)}
        itemTemplate={areaTemplate}
        itemRenderer={(area) => area.title || 'New Investment Area'}
      />
    );
  };

  const renderPortfolioCompaniesForm = () => {
    const companyTemplate = {
      name: '',
      description: '',
      sector: '',
      stage: '',
      website: '',
      logo_url: '',
      investment_amount: '',
      investment_date: ''
    };

    return (
      <ArrayItemEditor
        items={formData.companies || []}
        onUpdate={(companies) => updateFormData('companies', companies)}
        itemTemplate={companyTemplate}
        itemRenderer={(company) => company.name || 'New Company'}
      />
    );
  };

  const renderStatisticsForm = () => {
    const statTemplate = {
      value: '',
      label: '',
      suffix: '',
      description: ''
    };

    return (
      <ArrayItemEditor
        items={formData.statistics || []}
        onUpdate={(statistics) => updateFormData('statistics', statistics)}
        itemTemplate={statTemplate}
        itemRenderer={(stat) => `${stat.value} ${stat.label}` || 'New Statistic'}
      />
    );
  };

  const renderTestimonialsForm = () => {
    const testimonialTemplate = {
      name: '',
      title: '',
      company: '',
      quote: '',
      image_url: '',
      rating: ''
    };

    return (
      <ArrayItemEditor
        items={formData.testimonials || []}
        onUpdate={(testimonials) => updateFormData('testimonials', testimonials)}
        itemTemplate={testimonialTemplate}
        itemRenderer={(testimonial) => testimonial.name || 'New Testimonial'}
      />
    );
  };

  const renderCallToActionForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Call to Action</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Headline"
          value={formData.headline || ''}
          onChange={(e) => updateFormData('headline', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          value={formData.description || ''}
          onChange={(e) => updateFormData('description', e.target.value)}
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Primary Button Text"
          value={formData.primary_button_text || ''}
          onChange={(e) => updateFormData('primary_button_text', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Primary Button URL"
          value={formData.primary_button_url || ''}
          onChange={(e) => updateFormData('primary_button_url', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Secondary Button Text"
          value={formData.secondary_button_text || ''}
          onChange={(e) => updateFormData('secondary_button_text', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Secondary Button URL"
          value={formData.secondary_button_url || ''}
          onChange={(e) => updateFormData('secondary_button_url', e.target.value)}
        />
      </Grid>
    </Grid>
  );

  const renderTeamMembersForm = () => {
    const memberTemplate = {
      name: '',
      title: '',
      experience: '',
      education: '',
      linkedin_url: '',
      email: '',
      image_url: '',
      position: ''
    };

    return (
      <ArrayItemEditor
        items={formData.team_members || []}
        onUpdate={(team_members) => updateFormData('team_members', team_members)}
        itemTemplate={memberTemplate}
        itemRenderer={(member) => member.name || 'New Team Member'}
      />
    );
  };

  const renderTextSectionForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Text Section Content</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Heading"
          value={formData.heading || ''}
          onChange={(e) => updateFormData('heading', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Subheading"
          value={formData.subheading || ''}
          onChange={(e) => updateFormData('subheading', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Content"
          value={formData.content || ''}
          onChange={(e) => updateFormData('content', e.target.value)}
          multiline
          rows={6}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Button Text"
          value={formData.button_text || ''}
          onChange={(e) => updateFormData('button_text', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Button URL"
          value={formData.button_url || ''}
          onChange={(e) => updateFormData('button_url', e.target.value)}
        />
      </Grid>
    </Grid>
  );

  const renderJSONFallback = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="warning.main">
          JSON Editor (Fallback)
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          No specific form available for "{contentType}". Edit as JSON:
        </Typography>
        <TextField
          fullWidth
          label="Content (JSON)"
          value={JSON.stringify(formData, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setFormData(parsed);
              onChange(parsed);
            } catch (err) {
              // Invalid JSON, keep the string value for now
            }
          }}
          multiline
          rows={8}
          placeholder='{"key": "value"}'
          helperText="Enter valid JSON for complex content structures"
        />
      </Grid>
    </Grid>
  );

  // Render the appropriate form based on content type
  const renderForm = () => {
    switch (contentType) {
      case 'contact_info':
        return renderContactInfoForm();
      case 'office_locations':
        return renderOfficeLocationsForm();
      case 'form_config':
        return renderFormConfigForm();
      case 'feature_list':
        return renderFeatureListForm();
      case 'investment_areas':
        return renderInvestmentAreasForm();
      case 'portfolio_companies':
        return renderPortfolioCompaniesForm();
      case 'team_members':
        return renderTeamMembersForm();
      case 'statistics':
        return renderStatisticsForm();
      case 'testimonials':
        return renderTestimonialsForm();
      case 'call_to_action':
        return renderCallToActionForm();
      case 'text_section':
        return renderTextSectionForm();
      default:
        return renderJSONFallback();
    }
  };

  return (
    <Box>
      {renderForm()}
      
      {/* Show raw JSON preview for debugging */}
      <Divider sx={{ my: 3 }} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="body2" color="text.secondary">
            View Raw JSON (Debug)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            component="pre"
            sx={{
              backgroundColor: 'grey.100',
              p: 2,
              borderRadius: 1,
              fontSize: '0.75rem',
              overflow: 'auto',
              maxHeight: 200,
            }}
          >
            {JSON.stringify(formData, null, 2)}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}