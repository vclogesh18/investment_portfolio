-- Migration for branding content (logo and footer)
-- Created: 2025-10-04

-- Table for branding settings
CREATE TABLE IF NOT EXISTS branding_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  media_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default branding settings
INSERT INTO branding_settings (setting_key, setting_value, description) VALUES
('company_name', 'Seven Boson Group Ltd', 'Company name displayed in header and footer'),
('logo_alt_text', 'Seven Boson Group logo', 'Alt text for the company logo'),
('footer_tagline', 'Join Us in Shaping the Future', 'Main tagline in footer'),
('footer_description', 'If you''re driven to invest in high-yield, world-class assets with transformational potential, we invite you to explore our portfolio, connect with our leadership, and discover how Seven Boson Group Ltd can help you unlock exceptional value.', 'Footer description text'),
('footer_copyright', '© 2025 Seven Boson Group Ltd. All rights reserved.', 'Copyright text in footer'),
('contact_address', '4 W. 4th Street, San Mateo, California', 'Company address'),
('contact_email', 'chet.white@sevenbosongroup.com', 'Primary contact email'),
('contact_phone', '+1 (415) 940-1476', 'Primary contact phone'),
('contact_phone_secondary', '+91 984-144-5136', 'Secondary contact phone'),
('linkedin_url', 'https://www.linkedin.com/company/seven-boson-group', 'LinkedIn profile URL')
ON CONFLICT (setting_key) DO NOTHING;

-- Table for footer quick links
CREATE TABLE IF NOT EXISTS footer_links (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  is_external BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default footer links
INSERT INTO footer_links (label, url, position) VALUES
('About Us', '/about', 1),
('Investment Classes', '/investment-classes', 2),
('Portfolio', '/portfolio', 3),
('Our Team', '/team', 4),
('Apply', '/apply', 5),
('Contact', '/contact', 6)
ON CONFLICT DO NOTHING;

-- Update trigger for branding_settings
CREATE OR REPLACE FUNCTION update_branding_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_branding_settings_updated_at
    BEFORE UPDATE ON branding_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_branding_settings_updated_at();

-- Update trigger for footer_links
CREATE OR REPLACE FUNCTION update_footer_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_footer_links_updated_at
    BEFORE UPDATE ON footer_links
    FOR EACH ROW
    EXECUTE FUNCTION update_footer_links_updated_at();