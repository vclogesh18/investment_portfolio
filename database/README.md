# Database Setup Instructions

This guide will help you set up the PostgreSQL database for the Seven Boson Group CMS.

## Prerequisites

- PostgreSQL 12+ installed on your system
- Command line access to PostgreSQL (`psql`)

## Installation Steps

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
sudo systemctl enable postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database User

Connect to PostgreSQL as superuser:
```bash
sudo -u postgres psql
```

Create a new user and database:
```sql
-- Create user
CREATE USER seven_boson WITH PASSWORD 'your_secure_password';

-- Create database
CREATE DATABASE seven_boson_cms OWNER seven_boson;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE seven_boson_cms TO seven_boson;

-- Exit PostgreSQL
\q
```

### 3. Import Database Schema and Complete Data

First, create the database schema:
```bash
psql -U seven_boson -d seven_boson_cms -f database/schema.sql
```

Then import the complete real data:
```bash
psql -U seven_boson -d seven_boson_cms -f database/complete_data_import.sql
```

This will import complete real data including:
- **7 Team Members** with full professional backgrounds, experience, and education
- **6 Portfolio Companies** with detailed descriptions and sector information  
- **9 Investment Areas** (3 pillars + 6 sectors) with comprehensive descriptions
- **5 Global Office Locations** with full contact information and regional focus
- **Complete Page Content** for all website sections with realistic copy
- **Media Files** mapped to team photos and portfolio logos
- **Company Branding** information and styling

Or if you have specific database connection details:
```bash
psql -h localhost -U seven_boson -d seven_boson_cms -f database/schema.sql
psql -h localhost -U seven_boson -d seven_boson_cms -f database/complete_data_import.sql
```

**Alternative: Schema Only**
If you prefer to start with an empty database and add content via the admin panel:
```bash
# Import schema without data
psql -U seven_boson -d seven_boson_cms -f database/schema_only.sql
```

**One-Step Import (Schema + Data)**
For convenience, you can also use the schema.sql file which includes both schema and data:
```bash
psql -U seven_boson -d seven_boson_cms -f database/schema.sql
```

### 4. Environment Configuration

Create a `.env` file in the `backend/` directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=seven_boson_cms
DB_USER=seven_boson
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=5001
NODE_ENV=development

# Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### 5. Run Database Migrations (Optional)

If you prefer to use the migration scripts:
```bash
cd backend
npm run migrate
npm run seed
```

## Default Admin Credentials

After setup, you can log into the admin panel with:
- **Email**: admin@sevenboson.com
- **Password**: admin123

**⚠️ Important**: Change these credentials immediately after first login!

## Database Schema Overview

The database includes the following main tables:

- `admin_users` - Admin authentication
- `pages` - Website pages and metadata
- `content_blocks` - Dynamic content sections
- `media` - File uploads and images
- `team_members` - Team member profiles
- `portfolio_companies` - Portfolio company information
- `investment_areas` - Investment focus areas
- `office_locations` - Global office information
- `branding` - Company branding settings
- `blog_posts` - Blog system (optional)

## Troubleshooting

### Connection Issues

1. **Check PostgreSQL is running:**
   ```bash
   brew services list | grep postgresql  # macOS
   sudo systemctl status postgresql      # Linux
   ```

2. **Verify database exists:**
   ```bash
   psql -U seven_boson -c "\l"
   ```

3. **Test connection:**
   ```bash
   psql -U seven_boson -d seven_boson_cms -c "SELECT current_database();"
   ```

### Permission Issues

If you encounter permission errors:
```sql
-- Connect as superuser
sudo -u postgres psql

-- Grant additional permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO seven_boson;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO seven_boson;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO seven_boson;
```

### Reset Database

To completely reset the database:
```bash
# Drop and recreate database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS seven_boson_cms;"
sudo -u postgres psql -c "CREATE DATABASE seven_boson_cms OWNER seven_boson;"

# Re-import schema
psql -U seven_boson -d seven_boson_cms -f database/schema.sql
```

## Backup and Restore

### Create Backup
```bash
pg_dump -U seven_boson -h localhost seven_boson_cms > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore from Backup
```bash
psql -U seven_boson -d seven_boson_cms -f backup_file.sql
```

## Production Considerations

- Use strong passwords for database users
- Configure proper firewall rules
- Enable SSL connections
- Set up regular automated backups
- Monitor database performance and logs
- Consider connection pooling for high-traffic deployments