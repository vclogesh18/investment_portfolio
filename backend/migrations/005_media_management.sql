-- Migration: Add media management system
-- This migration sets up the media table and populates it with existing images

BEGIN;

-- Create media table if not exists (it might already exist from previous migrations)
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

-- Clear existing media entries to avoid duplicates
DELETE FROM media;

-- Insert existing images into media table

-- Team member images
INSERT INTO media (filename, original_name, file_path, mime_type, alt_text, category) VALUES
  ('Chet-White.png', 'Chet-White.png', '/images/teams/Chet-White.png', 'image/png', 'Chet White - Managing General Partner', 'team'),
  ('Benoy-Varghese.png', 'Benoy-Varghese.png', '/images/teams/Benoy-Varghese.png', 'image/png', 'Benoy Varghese - Managing Partner', 'team'),
  ('Chris-Jarrous.png', 'Chris-Jarrous.png', '/images/teams/Chris-Jarrous.png', 'image/png', 'Chris Jarrous - Managing Partner', 'team'),
  ('Jay-Amaran.png', 'Jay-Amaran.png', '/images/teams/Jay-Amaran.png', 'image/png', 'Jay Amaran - Director of Education and Government services', 'team'),
  ('John-Cooleen.png', 'John-Cooleen.png', '/images/teams/John-Cooleen.png', 'image/png', 'John Cooleen - Partner', 'team'),
  ('Ramesh-Santhanam.jpeg', 'Ramesh-Santhanam.jpeg', '/images/teams/Ramesh-Santhanam.jpeg', 'image/jpeg', 'Ramesh Santhanam - Managing Partner', 'team'),
  ('Aniruddh-Ramesh.jpg', 'Aniruddh-Ramesh.jpg', '/images/teams/Aniruddh-Ramesh.jpg', 'image/jpeg', 'Aniruddh Ramesh - Director of Technology', 'team');

-- Portfolio company logos
INSERT INTO media (filename, original_name, file_path, mime_type, alt_text, category) VALUES
  ('Redback_Networks.svg', 'Redback_Networks.svg', '/images/Redback_Networks.svg', 'image/svg+xml', 'Redback Networks logo', 'portfolio'),
  ('Procera.png', 'Procera.png', '/images/Procera.png', 'image/png', 'Procera logo', 'portfolio'),
  ('QuantAI-Digitial-logo.png', 'QuantAI-Digitial-logo.png', '/images/QuantAI-Digitial-logo.png', 'image/png', 'QuantAI Digital logo', 'portfolio'),
  ('gopebble.png', 'gopebble.png', '/images/gopebble.png', 'image/png', 'GoPebble logo', 'portfolio'),
  ('Biotricity.png', 'Biotricity.png', '/images/Biotricity.png', 'image/png', 'Biotricity logo', 'portfolio'),
  ('Telaverge.jpeg', 'Telaverge.jpeg', '/images/Telaverge.jpeg', 'image/jpeg', 'Telaverge logo', 'portfolio'),
  ('aquathermindia.jpeg', 'aquathermindia.jpeg', '/images/aquathermindia.jpeg', 'image/jpeg', 'Aquatherm India logo', 'portfolio'),
  ('zerocode.jpeg', 'zerocode.jpeg', '/images/zerocode.jpeg', 'image/jpeg', 'ZeroCode logo', 'portfolio');

-- Company logos
INSERT INTO media (filename, original_name, file_path, mime_type, alt_text, category) VALUES
  ('SEVEN-BOSON-LOGO.png', 'SEVEN-BOSON-LOGO.png', '/images/SEVEN-BOSON-LOGO.png', 'image/png', 'Seven Boson Group logo', 'brand'),
  ('Seven-Boson-tech.png', 'Seven-Boson-tech.png', '/images/Seven-Boson-tech.png', 'image/png', 'Seven Boson tech logo', 'brand');

-- Investment class images
INSERT INTO media (filename, original_name, file_path, mime_type, alt_text, category) VALUES
  ('Artificial-Intelligence.jpeg', 'Artificial-Intelligence.jpeg', '/images/investment-classes/Artificial-Intelligence.jpeg', 'image/jpeg', 'Artificial Intelligence investment focus', 'investment-classes'),
  ('Innovation-inv.jpeg', 'Innovation-inv.jpeg', '/images/investment-classes/Innovation-inv.jpeg', 'image/jpeg', 'Innovation investment focus', 'investment-classes'),
  ('ai_dynamic_scaling_data_center.png', 'ai_dynamic_scaling_data_center.png', '/images/investment-classes/ai_dynamic_scaling_data_center.png', 'image/png', 'AI dynamic scaling data center', 'investment-classes');

-- Hero background images (external URLs for now, but can be moved to local storage later)
INSERT INTO media (filename, original_name, file_path, mime_type, alt_text, category) VALUES
  ('hero-home-bg.jpeg', 'business-meeting-background', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920', 'image/jpeg', 'Business meeting background', 'hero-backgrounds'),
  ('hero-contact-bg.jpeg', 'office-building-background', 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1920', 'image/jpeg', 'Office building background', 'hero-backgrounds'),
  ('hero-apply-bg.jpeg', 'team-collaboration-background', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920', 'image/jpeg', 'Team collaboration background', 'hero-backgrounds'),
  ('hero-portfolio-bg.jpeg', 'investment-background', 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1920', 'image/jpeg', 'Investment portfolio background', 'hero-backgrounds'),
  ('hero-about-bg.jpeg', 'corporate-office-background', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920', 'image/jpeg', 'Corporate office background', 'hero-backgrounds'),
  ('investment-ai-bg.jpeg', 'ai-technology-background', 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=800', 'image/jpeg', 'AI technology background', 'hero-backgrounds'),
  ('investment-green-bg.jpeg', 'green-technology-background', 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800', 'image/jpeg', 'Green technology background', 'hero-backgrounds'),
  ('about-values-bg.jpeg', 'corporate-values-background', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800', 'image/jpeg', 'Corporate values background', 'hero-backgrounds');

COMMIT;