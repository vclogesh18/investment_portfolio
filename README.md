# Seven Boson Group - Investment Portfolio Website

A modern React/TypeScript website for Seven Boson Group Ltd, a private equity holding company, featuring a comprehensive CMS backend for content management.

## � Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Access Points](#-access-points)
- [Admin Login](#-admin-login)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### Main Website
- Modern React/TypeScript with Vite
- Tailwind CSS styling with responsive design
- Investment portfolio showcase
- Team member profiles
- Dynamic content management
- Contact and application forms
- SEO optimized

### CMS Backend
- PostgreSQL database with comprehensive schema
- JWT-based authentication and authorization
- RESTful API endpoints
- File upload and media management
- Rate limiting and security middleware
- Database migrations and seeding

### Admin Panel
- Material UI interface
- Content management for all website sections
- Image upload and organization
- SEO metadata editing
- User management and permissions
- Real-time content preview

## 🔧 Prerequisites

Before installing, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **PostgreSQL** (v12 or higher) - [Installation Guide](./database/README.md)
- **Git** - [Download](https://git-scm.com/)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/seven-boson-group.git
cd seven-boson-group
```

### 2. Install Dependencies

Install dependencies for all three components:

```bash
# Main website dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..

# Admin panel dependencies
cd admin-panel
npm install
cd ..
```

## 🗄️ Database Setup

The project uses PostgreSQL for data storage. Follow these steps to set up the database:

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database and User

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create user and database
CREATE USER seven_boson WITH PASSWORD 'your_secure_password';
CREATE DATABASE seven_boson_cms OWNER seven_boson;
GRANT ALL PRIVILEGES ON DATABASE seven_boson_cms TO seven_boson;
\q
```

### 3. Import Database Schema and Complete Data

**Option A: Two-Step Import (Recommended)**
```bash
# Step 1: Create database schema
psql -U seven_boson -d seven_boson_cms -f database/schema_only.sql

# Step 2: Import complete real data
psql -U seven_boson -d seven_boson_cms -f database/complete_data_import.sql
```

**Option B: One-Step Import**
```bash
# Import schema + data together
psql -U seven_boson -d seven_boson_cms -f database/schema.sql
```

**Option C: Schema Only (Empty Database)**
```bash
# Import only database structure, add content via admin panel
psql -U seven_boson -d seven_boson_cms -f database/schema_only.sql
```

**Complete Data Import Includes:**
- **7 Real team members** with full professional backgrounds and experience
- **6 Portfolio companies** with detailed descriptions and sector information
- **9 Investment focus areas** (3 pillars + 6 innovation sectors)
- **5 Global office locations** with complete contact information
- **All page content** with realistic copy for every website section
- **Media files** linked to team photos and portfolio company logos
- **Company branding** and styling information

📚 **Detailed database setup instructions**: [Database README](./database/README.md)

## ⚙️ Configuration

### 1. Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=seven_boson_cms
DB_USER=seven_boson
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key

# Server Configuration
PORT=5001
NODE_ENV=development

# Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### 2. Frontend Environment Variables (Optional)

Create a `.env` file in the project root if needed:

```env
VITE_API_URL=http://localhost:5001/api
```

## 🚀 Running the Application

### Option 1: Quick Start (Recommended)

```bash
# Make the start script executable
chmod +x start-cms.sh

# Start all services
./start-cms.sh
```

### Option 2: Manual Start

Open three terminal windows and run:

```bash
# Terminal 1: Backend API
cd backend
npm run dev

# Terminal 2: Admin Panel
cd admin-panel  
npm run dev

# Terminal 3: Main Website
npm run dev
```

### Option 3: Individual Components

Start components individually as needed:

```bash
# Backend only
cd backend && npm run dev

# Admin panel only
cd admin-panel && npm run dev

# Main website only
npm run dev
```

## 🌐 Access Points

Once running, access the application at:

- **Main Website**: http://localhost:5173
- **Admin Panel**: http://localhost:3001
- **Backend API**: http://localhost:5001

## 🔐 Admin Login

Default admin credentials for first-time setup:

- **Email**: admin@sevenboson.com
- **Password**: admin123

**⚠️ Security Note**: Change these credentials immediately after first login!

## 📁 Project Structure

```
seven-boson-group/
├── src/                          # Main React website
│   ├── components/               # Shared components (Header, Footer)
│   ├── pages/                    # Route components
│   ├── hooks/                    # Custom React hooks for API calls
│   ├── images/                   # Static assets
│   └── utils/                    # Utility functions
├── backend/                      # Node.js API server
│   ├── config/                   # Database and app configuration
│   ├── routes/                   # API route handlers
│   ├── middleware/               # Authentication and security middleware
│   ├── migrations/               # Database migration files
│   ├── scripts/                  # Database setup and seeding scripts
│   └── uploads/                  # File upload storage
├── admin-panel/                  # React admin interface
│   ├── src/
│   │   ├── components/           # Admin UI components
│   │   ├── pages/                # Admin pages
│   │   ├── contexts/             # React contexts
│   │   └── hooks/                # Admin-specific hooks
├── database/                     # Database schema and documentation
│   ├── schema.sql               # Complete database schema
│   └── README.md                # Database setup instructions
├── e2e-tests/                   # End-to-end testing
└── .github/                     # GitHub configuration
    └── copilot-instructions.md  # AI coding guidelines
```

## 🔨 Development

### Available Scripts

**Main Website:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend:**
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run migrate  # Run database migrations
npm run seed     # Seed database with sample data
```

**Admin Panel:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons

**Backend:**
- Node.js with Express
- PostgreSQL database
- JWT authentication
- Multer for file uploads
- Helmet for security
- Rate limiting

**Admin Panel:**
- React with Material UI
- React Hook Form
- Axios for API calls
- React Quill for rich text editing

### Database Management

**Migration Commands:**
```bash
cd backend
npm run migrate  # Create all tables
npm run seed     # Insert sample data
```

**Manual Database Operations:**
```bash
# Connect to database
psql -U seven_boson -d seven_boson_cms

# Backup database
pg_dump -U seven_boson seven_boson_cms > backup.sql

# Restore database
psql -U seven_boson -d seven_boson_cms < backup.sql
```

### API Endpoints

The backend provides RESTful APIs for:

- **Authentication**: `/api/auth/*`
- **Pages**: `/api/pages/*`
- **Content**: `/api/content/*`
- **Team**: `/api/team/*`
- **Portfolio**: `/api/portfolio/*`
- **Media**: `/api/media/*`
- **Investments**: `/api/investments/*`
- **Offices**: `/api/offices/*`

## 🚀 Deployment

### Production Build

```bash
# Build all components
npm run build
cd admin-panel && npm run build
```

### Environment Variables for Production

Update your `.env` files with production values:

```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_PASSWORD=your_secure_production_password
JWT_SECRET=your_production_jwt_secret
```

### Server Deployment

1. **Database Setup**: Ensure PostgreSQL is installed and configured
2. **Environment**: Set all required environment variables
3. **Dependencies**: Run `npm install --production` in all directories
4. **Database**: Import schema and run migrations
5. **Process Manager**: Use PM2 or similar for process management

```bash
# Using PM2
npm install -g pm2
pm2 start backend/server.js --name "seven-boson-api"
pm2 start admin-panel --name "seven-boson-admin"
```

### Static Site Deployment

The main website can be deployed to static hosting services:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment

## 🧪 Testing

### End-to-End Testing

The project includes comprehensive E2E tests using Playwright:

```bash
cd e2e-tests
npm install
npm test
```

Test coverage includes:
- Page functionality and navigation
- Content management operations
- Form submissions
- Performance and accessibility
- Cross-browser compatibility

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards

- **TypeScript**: Use strict type checking
- **ESLint**: Follow the configured rules
- **Prettier**: Format code consistently
- **Conventional Commits**: Use semantic commit messages

### AI Coding Guidelines

This project includes AI coding instructions at `.github/copilot-instructions.md` for consistent development patterns.

## 📄 License

This project is proprietary software owned by Seven Boson Group Ltd.

## 📞 Support

For technical support or questions:

- **Email**: support@sevenboson.com
- **Documentation**: [Project Wiki](https://github.com/yourusername/seven-boson-group/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/seven-boson-group/issues)

---

Built with ❤️ for Seven Boson Group Ltd
