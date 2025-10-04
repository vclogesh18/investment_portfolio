-- Migration script to create comprehensive page content management system
-- Run: psql -d seven_boson_cms -f migration_all_pages_content.sql

-- Update the existing pages table to include SEO and meta information
ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS og_image VARCHAR(500);
ALTER TABLE pages ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(500);

-- Create a comprehensive page content table that can handle different content types
CREATE TABLE IF NOT EXISTS page_content (
  id SERIAL PRIMARY KEY,
  page_slug VARCHAR(100) NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'hero', 'text_section', 'feature_list', 'contact_info', 'form_config'
  section_name VARCHAR(100), -- e.g. 'hero', 'philosophy', 'investment_types', 'office_locations'
  title TEXT,
  subtitle TEXT,
  description TEXT,
  content JSONB, -- Flexible JSON structure for complex content
  background_image_url VARCHAR(500),
  background_color VARCHAR(50),
  text_color VARCHAR(50),
  layout_type VARCHAR(50), -- 'full_width', 'two_column', 'grid', 'list'
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_content_page_slug ON page_content(page_slug);
CREATE INDEX IF NOT EXISTS idx_page_content_type ON page_content(content_type);
CREATE INDEX IF NOT EXISTS idx_page_content_section ON page_content(section_name);
CREATE INDEX IF NOT EXISTS idx_page_content_active ON page_content(is_active);

-- Insert page metadata for all pages
INSERT INTO pages (slug, title, meta_description, status, page_type) VALUES
('about', 'About Seven Boson Group', 'Learn about Seven Boson Group Ltd, a premier global private equity holding company focused on disruptive innovation and strategic investments.', 'published', 'about'),
('contact', 'Contact Us', 'Get in touch with Seven Boson Group. Contact our global offices in New York, London, and Singapore for investment opportunities.', 'published', 'contact'),
('portfolio', 'Portfolio', 'Explore Seven Boson Group''s portfolio of innovative companies across AI, MedTech, Quantum Computing, and other transformative sectors.', 'published', 'portfolio'),
('apply', 'Apply for Funding', 'Submit your funding application to Seven Boson Group. We invest in transformational companies with innovative solutions.', 'published', 'apply'),
('investment-classes', 'Investment Classes', 'Discover our diversified investment classes spanning strategic assets, private equity, and alternative investments.', 'published', 'investment-classes'),
('team', 'Our Team', 'Meet the experienced team behind Seven Boson Group''s investment success and strategic partnerships.', 'published', 'team')
ON CONFLICT (slug) DO UPDATE SET
title = EXCLUDED.title,
meta_description = EXCLUDED.meta_description,
updated_at = NOW();

-- ABOUT PAGE CONTENT
-- Hero section
INSERT INTO page_content (page_slug, content_type, section_name, title, description, background_image_url, position) VALUES
('about', 'hero', 'hero', 'About Seven Boson Group', 'Seven Boson Group Ltd delivers superior, high-yield, risk-adjusted returns by targeting the transformative growth of tomorrow''s most disruptive sectors — including AI-as-a-Service, Robotics, Quantum Computing, Next-Gen Energy, MedTech, and Core Enabling Technologies. Our portfolio is engineered to capture outsized returns by backing category-defining innovation at the inflection point of global adoption.', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920', 1);

-- Philosophy section
INSERT INTO page_content (page_slug, content_type, section_name, title, subtitle, description, layout_type, position) VALUES
('about', 'text_section', 'philosophy', 'Disciplined. Diversified. Data-Driven', NULL, 'We apply a disciplined GARP strategy across real estate, private equity, and alternatives—amplified by structured high-yield instruments and active management to unlock asymmetric, risk-adjusted returns.', 'two_column', 2);

-- Investment types section
INSERT INTO page_content (page_slug, content_type, section_name, title, description, content, layout_type, position) VALUES
('about', 'feature_list', 'investment_types', 'Investment Strategies', 'Our diversified approach across multiple asset classes and strategies', '[
  {"title": "Disruptive Innovation Funds", "description": "Investing in cutting-edge tech (AI, MedTech, Quantum) through hedge and venture funds.", "icon": "Zap"},
  {"title": "Distressed Private Equity (LBO)", "description": "Control positions in undervalued companies with 2–5x leverage for turnaround and growth.", "icon": "Users"},
  {"title": "Strategic Assets", "description": "High-yield, fully-levered strategic assets (8–10x) with strong cash flow and appreciation potential.", "icon": "Globe"},
  {"title": "High-Yield Structured Portfolio", "description": "Targeting 8–15% yield or 35–50% ROI via preferred equity, convertible or high-yield debt.", "icon": "TrendingUp"},
  {"title": "Active Management Support", "description": "Hands-on growth support to accelerate revenue and profits through corporate venture strategies.", "icon": "Shield"},
  {"title": "Distressed GARP (LBO)", "description": "Opportunistic LBOs with strong fundamentals at deep discounts for high upside, low risk.", "icon": "Target"}
]'::jsonb, 'grid', 3);

-- CONTACT PAGE CONTENT
-- Hero section
INSERT INTO page_content (page_slug, content_type, section_name, title, description, background_image_url, position) VALUES
('contact', 'hero', 'hero', 'Get in Touch With Us', 'Ready to explore investment opportunities or discuss partnership possibilities? Our team is here to help you navigate your next strategic move.', 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1920', 1);

-- Update existing office_locations with more detailed information for contact page
UPDATE office_locations SET 
  address = '350 Fifth Avenue, Suite 7810, New York, NY 10118',
  phone = '+1 (212) 555-0123',
  email = 'ny@sevenboson.com'
WHERE name = 'New York' OR logo = 'NY';

INSERT INTO office_locations (name, address, phone, email, logo, sector, position, is_active) VALUES
('London', '25 Old Broad Street, London EC2N 1HQ, United Kingdom', '+44 20 7555 0123', 'london@sevenboson.com', 'LON', 'European Operations', 2, true),
('Singapore', '1 Raffles Quay, #26-10, Singapore 048583', '+65 6555 0123', 'singapore@sevenboson.com', 'SG', 'Asia Pacific Operations', 3, true)
ON CONFLICT (name) DO UPDATE SET
address = EXCLUDED.address,
phone = EXCLUDED.phone,
email = EXCLUDED.email,
updated_at = NOW();

-- PORTFOLIO PAGE CONTENT
-- Hero section
INSERT INTO page_content (page_slug, content_type, section_name, title, description, background_image_url, position) VALUES
('portfolio', 'hero', 'hero', 'Portfolio Companies', 'Explore our diverse portfolio of innovative companies across transformative sectors', 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1920', 1);

-- APPLY PAGE CONTENT
-- Hero section
INSERT INTO page_content (page_slug, content_type, section_name, title, description, background_image_url, position) VALUES
('apply', 'hero', 'hero', 'Apply for Funding', 'Are you building a transformational company? We''re looking for exceptional entrepreneurs with innovative solutions that have the potential to reshape industries.', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920', 1);

-- Form configuration
INSERT INTO page_content (page_slug, content_type, section_name, title, description, content, position) VALUES
('apply', 'form_config', 'application_form', 'Investment Application', 'Tell us about your company and funding needs. We typically respond within 48 hours.', '[
  {"field": "investment_stage", "options": ["pre-seed", "seed", "series-a", "series-b", "series-c", "growth", "bridge"], "label": "Investment Stage"},
  {"field": "funding_amount", "options": ["under-1m", "1m-5m", "5m-15m", "15m-50m", "50m-plus"], "label": "Funding Amount"},
  {"field": "industry", "options": ["ai-ml", "medtech", "quantum-computing", "clean-energy", "robotics", "cybersecurity", "biotech", "other"], "label": "Industry"}
]'::jsonb, 2);

-- INVESTMENT CLASSES PAGE CONTENT
-- Hero section
INSERT INTO page_content (page_slug, content_type, section_name, title, description, background_image_url, position) VALUES
('investment-classes', 'hero', 'hero', 'High-Growth Investment Classes Across Global Markets', 'Diversified portfolio spanning strategic assets, private equity, and alternative investments in the world''s most innovative sectors.', 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1920', 1);

-- Investment class sections
INSERT INTO page_content (page_slug, content_type, section_name, title, description, content, background_image_url, layout_type, position) VALUES
('investment-classes', 'text_section', 'ai_section', 'Artificial Intelligence & Machine Learning', 'Transforming industries through intelligent automation, predictive analytics, and next-generation AI platforms that deliver exponential value creation.', '{"highlights": ["Advanced AI Platforms", "Autonomous Systems", "Predictive Analytics", "Computer Vision", "Natural Language Processing"]}', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg', 'full_width', 2),

('investment-classes', 'text_section', 'green_tech', 'Green Technology & Sustainability', 'Leading the transition to sustainable energy through breakthrough clean technologies, renewable infrastructure, and carbon-neutral innovations.', '{"highlights": ["Solar & Wind Energy", "Energy Storage", "Smart Grid Technology", "Carbon Capture", "Sustainable Materials"]}', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg', 'full_width', 3),

('investment-classes', 'text_section', 'medtech', 'Medical Technology & Healthcare', 'Revolutionizing healthcare delivery through precision medicine, digital health platforms, and breakthrough medical devices.', '{"highlights": ["Digital Health Platforms", "Medical Devices", "Precision Medicine", "Telemedicine", "Health Analytics"]}', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg', 'full_width', 4);

-- TEAM PAGE CONTENT (for future use)
-- Hero section
INSERT INTO page_content (page_slug, content_type, section_name, title, description, background_image_url, position) VALUES
('team', 'hero', 'hero', 'Our Leadership Team', 'Meet the experienced professionals driving Seven Boson Group''s investment success and strategic partnerships across global markets.', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920', 1);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_page_content_updated_at 
    BEFORE UPDATE ON page_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Update pages table trigger as well
CREATE TRIGGER update_pages_updated_at 
    BEFORE UPDATE ON pages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;