import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  People,
  Business,
  TrendingUp,
  Photo,
} from '@mui/icons-material';
import axios from 'axios';

const StatCard = ({ title, value, icon, color, loading }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {loading ? <LinearProgress /> : value}
          </Typography>
        </Box>
        <Box sx={{ color, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    team: 0,
    portfolio: 0,
    investments: 0,
    media: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [teamRes, portfolioRes, investmentRes, mediaRes] = await Promise.allSettled([
        axios.get('/api/team'),
        axios.get('/api/portfolio'),
        axios.get('/api/investments'),
        axios.get('/api/media')
      ]);

      setStats({
        team: teamRes.status === 'fulfilled' ? teamRes.value.data.length : 0,
        portfolio: portfolioRes.status === 'fulfilled' ? portfolioRes.value.data.length : 0,
        investments: investmentRes.status === 'fulfilled' ? investmentRes.value.data.length : 0,
        media: mediaRes.status === 'fulfilled' ? mediaRes.value.data.media?.length || 0 : 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b' }}>
        Dashboard
      </Typography>
      <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
        Welcome to Seven Boson Group CMS Admin Panel
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Team Members"
            value={stats.team}
            icon={<People />}
            color="#3b82f6"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Portfolio Companies"
            value={stats.portfolio}
            icon={<Business />}
            color="#10b981"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Investment Areas"
            value={stats.investments}
            icon={<TrendingUp />}
            color="#f59e0b"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Media Files"
            value={stats.media}
            icon={<Photo />}
            color="#8b5cf6"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use the navigation menu to manage your content:
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Team Members:</strong> Add and edit team member profiles
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Portfolio:</strong> Manage portfolio companies and logos
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Investments:</strong> Edit investment pillars and sectors
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Media Library:</strong> Upload and organize images
              </Typography>
              <Typography variant="body2">
                • <strong>Pages:</strong> Manage page content and SEO metadata
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                bgcolor: '#10b981', 
                mr: 1 
              }} />
              <Typography variant="body2">
                Backend API: Connected
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                bgcolor: '#10b981', 
                mr: 1 
              }} />
              <Typography variant="body2">
                Database: Online
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                bgcolor: '#10b981', 
                mr: 1 
              }} />
              <Typography variant="body2">
                Authentication: Active
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}