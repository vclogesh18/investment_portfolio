# Deployment Guide

This guide covers deploying the Seven Boson Group website and CMS to various hosting platforms.

## 📋 Table of Contents

- [Production Build](#production-build)
- [Environment Configuration](#environment-configuration)
- [Database Deployment](#database-deployment)
- [Static Site Deployment](#static-site-deployment)
- [Full Stack Deployment](#full-stack-deployment)
- [CI/CD Setup](#cicd-setup)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## 🏗️ Production Build

### Build All Components

```bash
# Main website
npm run build

# Admin panel
cd admin-panel
npm run build

# Backend (no build needed, but install production dependencies)
cd backend
npm install --production
```

### Build Output

- **Main website**: `dist/` folder
- **Admin panel**: `admin-panel/dist/` folder
- **Backend**: Ready to run with `npm start`

## ⚙️ Environment Configuration

### Production Environment Variables

Create production `.env` file in `backend/`:

```env
# Database Configuration
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=seven_boson_cms
DB_USER=your_production_db_user
DB_PASSWORD=your_secure_production_password

# JWT Configuration
JWT_SECRET=your_very_secure_production_jwt_secret_64_characters_minimum
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5001
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=https://your-domain.com,https://admin.your-domain.com

# Upload Configuration
UPLOAD_PATH=/var/uploads
MAX_FILE_SIZE=10485760

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🗄️ Database Deployment

### Managed Database Services

**Recommended Options:**
- **AWS RDS** (PostgreSQL)
- **Google Cloud SQL**
- **Azure Database for PostgreSQL**
- **DigitalOcean Managed Databases**
- **Heroku Postgres**

### Database Setup

1. **Create production database**
2. **Import schema**:
   ```bash
   psql -h your-db-host -U your-db-user -d seven_boson_cms -f database/schema.sql
   ```
3. **Configure connection pooling** (recommended for production)
4. **Set up automated backups**
5. **Configure monitoring**

### Database Migration

```bash
# Export from development
pg_dump -U seven_boson -d seven_boson_cms > production_export.sql

# Import to production
psql -h production-host -U production-user -d seven_boson_cms -f production_export.sql
```

## 🌐 Static Site Deployment

For the main website (React SPA), you can deploy to static hosting services.

### Vercel Deployment

1. **Connect GitHub repository** to Vercel
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Node.js Version: 18.x

3. **Environment variables** (if API integration needed):
   ```
   VITE_API_URL=https://api.your-domain.com
   ```

### Netlify Deployment

1. **Connect GitHub repository** to Netlify
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Add redirects** for SPA routing (`public/_redirects`):
   ```
   /*    /index.html   200
   ```

### AWS S3 + CloudFront

```bash
# Build the project
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR-DISTRIBUTION-ID --paths "/*"
```

### GitHub Pages

```yaml
# .github/workflows/deploy-gh-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm ci
    - run: npm run build
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🚀 Full Stack Deployment

For complete CMS functionality, deploy all three components.

### DigitalOcean App Platform

1. **Create new app** from GitHub repository
2. **Configure services**:

   **Backend API:**
   - Type: Web Service
   - Source: `backend/`
   - Build Command: `npm install`
   - Run Command: `npm start`
   - HTTP Port: 5001

   **Admin Panel:**
   - Type: Static Site
   - Source: `admin-panel/`
   - Build Command: `npm run build`
   - Output Directory: `dist`

   **Main Website:**
   - Type: Static Site
   - Source: `/`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add managed database** (PostgreSQL)
4. **Configure environment variables**

### Heroku Deployment

```bash
# Install Heroku CLI and login
heroku login

# Create applications
heroku create seven-boson-api
heroku create seven-boson-admin
heroku create seven-boson-web

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev -a seven-boson-api

# Deploy backend
cd backend
git init
heroku git:remote -a seven-boson-api
git add .
git commit -m "Initial deployment"
git push heroku main

# Configure environment variables
heroku config:set JWT_SECRET=your_secret -a seven-boson-api
```

### AWS EC2 Deployment

```bash
# Connect to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update
sudo apt install nodejs npm postgresql nginx

# Clone repository
git clone https://github.com/yourusername/seven-boson-group.git
cd seven-boson-group

# Install dependencies
npm install
cd backend && npm install
cd ../admin-panel && npm install

# Build frontend components
npm run build
cd admin-panel && npm run build

# Configure PM2 for process management
sudo npm install -g pm2
pm2 start backend/server.js --name "seven-boson-api"
pm2 startup
pm2 save

# Configure Nginx
sudo nano /etc/nginx/sites-available/seven-boson
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Main website
    location / {
        root /path/to/seven-boson-group/dist;
        try_files $uri $uri/ /index.html;
    }

    # Admin panel
    location /admin {
        alias /path/to/seven-boson-group/admin-panel/dist;
        try_files $uri $uri/ /admin/index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Deployment

**Multi-container setup with Docker Compose:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  database:
    image: postgres:14
    environment:
      POSTGRES_DB: seven_boson_cms
      POSTGRES_USER: seven_boson
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql

  backend:
    build: ./backend
    depends_on:
      - database
    environment:
      DB_HOST: database
      DB_NAME: seven_boson_cms
      DB_USER: seven_boson
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "5001:5001"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./dist:/usr/share/nginx/html
      - ./admin-panel/dist:/usr/share/nginx/html/admin
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 🔄 CI/CD Setup

The project includes GitHub Actions workflows for automated deployment.

### Environment Secrets

Configure these secrets in your GitHub repository:

- `DB_PASSWORD`: Production database password
- `JWT_SECRET`: Production JWT secret
- `VERCEL_TOKEN`: For Vercel deployment
- `AWS_ACCESS_KEY_ID`: For AWS deployment
- `AWS_SECRET_ACCESS_KEY`: For AWS deployment

### Deployment Triggers

- **Main branch**: Deploys to production
- **Develop branch**: Deploys to staging
- **Pull requests**: Runs tests only

## 📊 Monitoring and Maintenance

### Health Checks

Add health check endpoints:

```javascript
// backend/routes/health.js
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});
```

### Monitoring Tools

- **Application Monitoring**: New Relic, DataDog
- **Database Monitoring**: Built-in provider tools
- **Uptime Monitoring**: Pingdom, UptimeRobot
- **Error Tracking**: Sentry

### Maintenance Tasks

**Regular Backups:**
```bash
# Automated backup script
0 2 * * * /path/to/backup-db.sh
```

**Security Updates:**
```bash
# Update dependencies
npm audit fix
cd backend && npm audit fix
cd admin-panel && npm audit fix
```

**Performance Monitoring:**
- Database query optimization
- CDN cache hit rates
- API response times
- Frontend Core Web Vitals

### SSL Certificate

For production, ensure HTTPS is enabled:

**Let's Encrypt with Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection**: Check environment variables and network access
2. **CORS Errors**: Update CORS_ORIGIN in backend configuration
3. **Build Failures**: Verify Node.js version compatibility
4. **Memory Issues**: Increase server resources or optimize queries

### Logs

- **Backend logs**: `pm2 logs` or application logs
- **Nginx logs**: `/var/log/nginx/access.log`
- **Database logs**: Provider-specific locations

---

For more deployment options and detailed configurations, refer to the specific hosting provider documentation.