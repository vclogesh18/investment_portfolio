-- Migration for homepage content management
-- This creates tables to store all static content from the homepage

-- Hero section content
CREATE TABLE IF NOT EXISTS hero_sections (
  id SERIAL PRIMARY KEY,
  page_slug VARCHAR(100) NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  background_image_url TEXT,
  primary_cta_text VARCHAR(100),
  primary_cta_link VARCHAR(200),
  secondary_cta_text VARCHAR(100),
  secondary_cta_link VARCHAR(200),
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Page sections (reusable content blocks)
CREATE TABLE IF NOT EXISTS page_sections (
  id SERIAL PRIMARY KEY,
  page_slug VARCHAR(100) NOT NULL,
  section_type VARCHAR(50) NOT NULL, -- 'content', 'quote', 'cta', 'hero'
  title TEXT,
  subtitle TEXT,
  description TEXT,
  content JSONB, -- For flexible content storage
  background_color VARCHAR(50),
  text_color VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Quotes/testimonials
CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  quote_text TEXT NOT NULL,
  author VARCHAR(200),
  author_title VARCHAR(200),
  author_image_url TEXT,
  page_slug VARCHAR(100),
  section_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Call-to-action sections
CREATE TABLE IF NOT EXISTS cta_sections (
  id SERIAL PRIMARY KEY,
  page_slug VARCHAR(100) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  primary_button_text VARCHAR(100),
  primary_button_link VARCHAR(200),
  secondary_button_text VARCHAR(100),
  secondary_button_link VARCHAR(200),
  background_color VARCHAR(50),
  text_color VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hero_sections_page_slug ON hero_sections(page_slug);
CREATE INDEX IF NOT EXISTS idx_page_sections_page_slug ON page_sections(page_slug);
CREATE INDEX IF NOT EXISTS idx_quotes_page_slug ON quotes(page_slug);
CREATE INDEX IF NOT EXISTS idx_cta_sections_page_slug ON cta_sections(page_slug);