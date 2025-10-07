import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import pagesRoutes from './routes/pages.js';
import mediaRoutes from './routes/media.js';
import mediaUsageRoutes from './routes/mediaUsage.js';
import teamRoutes from './routes/team.js';
import portfolioRoutes from './routes/portfolio.js';
import investmentRoutes from './routes/investments.js';
import officesRoutes from './routes/offices.js';
import pageContentRoutes from './routes/pageContent.js';
import homepageRoutes from './routes/homepage.js';
import brandingRoutes from './routes/branding.js';
import blogRoutes from './routes/blog.js';
import formsRoutes from './routes/forms.js';
import formFieldsRoutes from './routes/formFields.js';

// ES module setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// Rate limiting (disabled for testing)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 10000, // Very high limit for testing
  message: 'Too many requests from this IP, please try again later.'
});
// Temporarily comment out rate limiting
// app.use('/api/', limiter);

// CORS configuration - must be before static file serving
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.ADMIN_PANEL_URL || 'http://localhost:3001',
    'http://localhost:3002'  // Additional port for admin panel
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type']
}));

// Add CORS headers for static files
app.use('/images', (req, res, next) => {
  const origin = req.get('Origin');
  const allowedOrigins = [
    'http://localhost:3002',
    'http://localhost:3001', 
    'http://localhost:5173'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use('/uploads', (req, res, next) => {
  const origin = req.get('Origin');
  const allowedOrigins = [
    'http://localhost:3002',
    'http://localhost:3001', 
    'http://localhost:5173'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Static file serving
app.use('/images', express.static(path.join(__dirname, '../src/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/media-usage', mediaUsageRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/offices', officesRoutes);
app.use('/api/content', pageContentRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/branding', brandingRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/form-fields', formFieldsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Seven Boson CMS Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});