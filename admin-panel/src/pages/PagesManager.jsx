import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Home,
  Info,
  Business,
  People,
  Phone,
  Description,
} from '@mui/icons-material';
import UniversalPageEditor from '../components/UniversalPageEditor';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`page-tabpanel-${index}`}
      aria-labelledby={`page-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const pages = [
  { label: 'Homepage', icon: <Home />, slug: 'home' },
  { label: 'About', icon: <Info />, slug: 'about' },
  { label: 'Portfolio', icon: <Business />, slug: 'portfolio' },
  { label: 'Team', icon: <People />, slug: 'team' },
  { label: 'Contact', icon: <Phone />, slug: 'contact' },
  { label: 'Investment Classes', icon: <Description />, slug: 'investment-classes' },
  { label: 'Apply', icon: <Description />, slug: 'apply' },
];

export default function PagesManager() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b', mb: 3 }}>
        Universal Pages Manager
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            },
          }}
        >
          {pages.map((page, index) => (
            <Tab
              key={page.slug}
              icon={page.icon}
              label={page.label}
              iconPosition="start"
              sx={{
                '& .MuiTab-iconWrapper': {
                  marginRight: 1,
                  marginBottom: '0 !important',
                },
              }}
            />
          ))}
        </Tabs>

        {pages.map((page, index) => (
          <TabPanel key={page.slug} value={activeTab} index={index}>
            <UniversalPageEditor 
              pageSlug={page.slug} 
              pageTitle={page.label}
              key={page.slug}
            />
          </TabPanel>
        ))}
      </Paper>
    </Box>
  );
}