-- Seven Boson Group CMS Database Schema
-- PostgreSQL Database Setup

-- Create database (run this first as superuser)
-- CREATE DATABASE seven_boson_cms;

-- Connect to the database and run the following:

-- Create admin_users table first (no dependencies)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create media table (used by other tables as foreign key)
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_path VARCHAR(255) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  alt_text VARCHAR(255),
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_description TEXT,
  hero_title TEXT,
  hero_description TEXT,
  hero_background_image VARCHAR(255),
  status VARCHAR(20) DEFAULT 'published',
  page_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create content_blocks table
CREATE TABLE IF NOT EXISTS content_blocks (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
  block_type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  content JSONB,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  experience TEXT,
  education TEXT,
  linkedin_url VARCHAR(255),
  email VARCHAR(255),
  image_id INTEGER REFERENCES media(id),
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create portfolio_companies table
CREATE TABLE IF NOT EXISTS portfolio_companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  sector VARCHAR(100),
  logo_id INTEGER REFERENCES media(id),
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create investment_areas table
CREATE TABLE IF NOT EXISTS investment_areas (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  category VARCHAR(50),
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create office_locations table
CREATE TABLE IF NOT EXISTS office_locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  logo VARCHAR(10),
  sector VARCHAR(100),
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create form_configs table
CREATE TABLE IF NOT EXISTS form_configs (
  id SERIAL PRIMARY KEY,
  form_name VARCHAR(100) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  field_type VARCHAR(50),
  options JSONB,
  is_required BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create branding table
CREATE TABLE IF NOT EXISTS branding (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL DEFAULT 'Seven Boson Group',
  logo_url VARCHAR(255),
  primary_color VARCHAR(7) DEFAULT '#f59e0b',
  secondary_color VARCHAR(7) DEFAULT '#64748b',
  tagline TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create page_content table
CREATE TABLE IF NOT EXISTS page_content (
  id SERIAL PRIMARY KEY,
  page_slug VARCHAR(255) NOT NULL,
  section_name VARCHAR(255) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(page_slug, section_name)
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image_id INTEGER REFERENCES media(id),
  author_id INTEGER REFERENCES admin_users(id),
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create blog_post_categories junction table
CREATE TABLE IF NOT EXISTS blog_post_categories (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES blog_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_page_type ON pages(page_type);
CREATE INDEX IF NOT EXISTS idx_content_blocks_page_id ON content_blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_content_blocks_position ON content_blocks(position);
CREATE INDEX IF NOT EXISTS idx_team_members_position ON team_members(position);
CREATE INDEX IF NOT EXISTS idx_portfolio_companies_position ON portfolio_companies(position);
CREATE INDEX IF NOT EXISTS idx_investment_areas_position ON investment_areas(position);
CREATE INDEX IF NOT EXISTS idx_office_locations_position ON office_locations(position);
CREATE INDEX IF NOT EXISTS idx_page_content_page_slug ON page_content(page_slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, role) 
VALUES ('admin@sevenboson.com', '$2a$10$rQjZjGGUMcq7h9UxjM8j9eKQJdF9Zrr1XtGKjJqPOeYnH4F6vDPRm', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert basic branding
INSERT INTO branding (company_name, tagline, description)
VALUES (
  'Seven Boson Group',
  'Delivering superior, high-yield investment solutions',
  'Seven Boson Group Ltd delivers superior, high-yield investment solutions across cutting-edge sectors including AI, quantum computing, green technology, and medical innovation.'
)
ON CONFLICT DO NOTHING;

-- Insert sample pages for CMS structure
INSERT INTO pages (slug, title, meta_description, page_type) VALUES
  ('home', 'Seven Boson Group - Investment Portfolio', 'Private equity holding company specializing in disruptive technology investments', 'home'),
  ('about', 'About Seven Boson Group', 'Learn about our investment philosophy and global presence', 'about'),
  ('portfolio', 'Our Portfolio', 'Discover our portfolio of innovative companies', 'portfolio'),
  ('team', 'Our Team', 'Meet the experienced professionals behind Seven Boson Group', 'team'),
  ('investment-classes', 'Investment Classes', 'Explore our investment focus areas and strategies', 'investment-classes'),
  ('apply', 'Apply for Investment', 'Submit your company for investment consideration', 'apply'),
  ('contact', 'Contact Us', 'Get in touch with Seven Boson Group', 'contact')
ON CONFLICT (slug) DO NOTHING;

COMMIT;