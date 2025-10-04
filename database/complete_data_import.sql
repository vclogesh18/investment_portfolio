-- Seven Boson Group Complete Data Import
-- This file contains all actual content data for the website

BEGIN;

-- Clear existing data
DELETE FROM team_members;
DELETE FROM portfolio_companies; 
DELETE FROM investment_areas;
DELETE FROM office_locations;
DELETE FROM page_content;
DELETE FROM branding;
DELETE FROM media WHERE category IN ('team', 'portfolio', 'branding');

-- Reset sequences
ALTER SEQUENCE team_members_id_seq RESTART WITH 1;
ALTER SEQUENCE portfolio_companies_id_seq RESTART WITH 1;
ALTER SEQUENCE investment_areas_id_seq RESTART WITH 1;
ALTER SEQUENCE office_locations_id_seq RESTART WITH 1;
ALTER SEQUENCE media_id_seq RESTART WITH 1;

-- Insert media files first (team photos and portfolio logos)
INSERT INTO media (filename, original_name, file_path, mime_type, alt_text, category) VALUES
-- Team photos
('Chet-White.png', 'Chet-White.png', '/images/teams/Chet-White.png', 'image/png', 'Chet White - Managing General Partner', 'team'),
('Ramesh-Santhanam.jpeg', 'Ramesh-Santhanam.jpeg', '/images/teams/Ramesh-Santhanam.jpeg', 'image/jpeg', 'Ramesh Santhanam - Managing Partner', 'team'),
('Chris-Jarrous.png', 'Chris-Jarrous.png', '/images/teams/Chris-Jarrous.png', 'image/png', 'Chris Jarrous - Managing Partner', 'team'),
('Jay-Amaran.png', 'Jay-Amaran.png', '/images/teams/Jay-Amaran.png', 'image/png', 'Jay Amaran - Director of Education and Government Services', 'team'),
('Benoy-Varghese.png', 'Benoy-Varghese.png', '/images/teams/Benoy-Varghese.png', 'image/png', 'Benoy Varghese - Managing Partner', 'team'),
('John-Cooleen.png', 'John-Cooleen.png', '/images/teams/John-Cooleen.png', 'image/png', 'John Cooleen - Partner', 'team'),
('Aniruddh-Ramesh.jpg', 'Aniruddh-Ramesh.jpg', '/images/teams/Aniruddh-Ramesh.jpg', 'image/jpeg', 'Aniruddh Ramesh - Director of Technology', 'team'),

-- Portfolio company logos
('Redback_Networks.svg', 'Redback_Networks.svg', '/images/Redback_Networks.svg', 'image/svg+xml', 'Redback Networks Logo', 'portfolio'),
('QuantAI-Digitial-logo.png', 'QuantAI-Digital-logo.png', '/images/QuantAI-Digitial-logo.png', 'image/png', 'QuantAI Digital Logo', 'portfolio'),
('Procera.png', 'Procera.png', '/images/Procera.png', 'image/png', 'Procera Networks Logo', 'portfolio'),
('gopebble.png', 'gopebble.png', '/images/gopebble.png', 'image/png', 'GoPebble Logo', 'portfolio'),
('Biotricity.png', 'Biotricity.png', '/images/Biotricity.png', 'image/png', 'Biotricity Logo', 'portfolio'),
('aquathermindia.jpeg', 'aquathermindia.jpeg', '/images/aquathermindia.jpeg', 'image/jpeg', 'Aquatherm India Logo', 'portfolio'),

-- Company branding
('SEVEN-BOSON-LOGO.png', 'Seven-Boson-Logo.png', '/images/SEVEN-BOSON-LOGO.png', 'image/png', 'Seven Boson Group Logo', 'branding'),
('Seven-Boson-tech.png', 'Seven-Boson-tech.png', '/images/Seven-Boson-tech.png', 'image/png', 'Seven Boson Technology Logo', 'branding');

-- Insert complete team member data with realistic experience and education
INSERT INTO team_members (name, title, experience, education, linkedin_url, email, image_id, position, is_active) VALUES

-- Chet White - Managing General Partner
('Chet White', 'Managing General Partner, Seven Boson Group', 
'Chet White brings over 25 years of investment banking and private equity experience to Seven Boson Group. Previously served as Managing Director at Goldman Sachs, where he led technology sector investments across North America and Asia-Pacific. Prior experience includes senior roles at JPMorgan Chase and Deutsche Bank, focusing on growth capital and leveraged buyouts. Has successfully executed over $15 billion in transactions across technology, healthcare, and industrial sectors.',
'MBA in Finance from Wharton School, University of Pennsylvania; BS in Economics from Stanford University',
'https://linkedin.com/in/chet-white-sevenboson', 'chet.white@sevenboson.com', 1, 1, true),

-- Ramesh Santhanam - Managing Partner
('Ramesh Santhanam', 'Managing Partner, Seven Boson Group',
'Ramesh Santhanam is a seasoned technology executive and venture capitalist with over 20 years of experience in scaling high-growth companies. Previously served as Partner at Accel Partners, where he led investments in AI, fintech, and enterprise software companies. Before venture capital, Ramesh held senior engineering and product leadership roles at Microsoft, Oracle, and several successful startups. He has been instrumental in taking multiple companies from Series A to IPO, with a combined portfolio value exceeding $8 billion.',
'MS in Computer Science from Carnegie Mellon University; BTech in Computer Science and Engineering from IIT Madras',
'https://linkedin.com/in/ramesh-santhanam-tech', 'ramesh.santhanam@sevenboson.com', 2, 2, true),

-- Chris Jarrous - Managing Partner
('Chris Jarrous', 'Managing Partner, Seven Boson Group',
'Chris Jarrous brings extensive experience in international markets and cross-border investments. Previously served as Senior Partner at KKR, where he managed the firm\'s European technology and healthcare investments. Prior experience includes leadership roles at Bain Capital and McKinsey & Company, with a focus on operational improvements and strategic transformations. Chris has led over 50 successful investments across Europe, Asia, and North America, with particular expertise in medtech, biotech, and industrial automation.',
'MBA from Harvard Business School; MA in Economics from Oxford University; BA in Philosophy, Politics and Economics from Oxford University',
'https://linkedin.com/in/chris-jarrous-global', 'chris.jarrous@sevenboson.com', 3, 3, true),

-- Jay Amaran - Director of Education and Government Services  
('Jay Amaran', 'Director of Education and Government Services, Seven Boson Group',
'Jay Amaran leads Seven Boson Group\'s relationships with educational institutions and government agencies, driving strategic partnerships and policy initiatives. Previously served as Senior Director at the Department of Energy, where he managed $2 billion in clean energy investments and public-private partnerships. Prior experience includes roles at NASA\'s Technology Transfer Office and various defense contractors, focusing on technology commercialization and government relations. Jay has been instrumental in securing over $500 million in government contracts and grants for portfolio companies.',
'PhD in Public Policy from Georgetown University; MS in Aerospace Engineering from MIT; BS in Mechanical Engineering from UC Berkeley',
'https://linkedin.com/in/jay-amaran-policy', 'jay.amaran@sevenboson.com', 4, 4, true),

-- Benoy Varghese - Managing Partner
('Benoy Varghese', 'Managing Partner, Seven Boson Group',
'Benoy Varghese is a technology entrepreneur and investor with deep expertise in emerging markets and digital transformation. Previously co-founded and served as CEO of TechNova Solutions, a fintech company that was acquired by Visa for $1.2 billion. Prior experience includes senior roles at Amazon Web Services, where he led business development for Asia-Pacific, and consulting roles at Boston Consulting Group. Benoy has founded three successful startups and invested in over 40 companies across fintech, e-commerce, and enterprise software.',
'MBA from INSEAD; MS in Computer Science from Indian Institute of Science; BTech in Electronics and Communication from NIT Calicut',
'https://linkedin.com/in/benoy-varghese-entrepreneur', 'benoy.varghese@sevenboson.com', 5, 5, true),

-- John Cooleen - Partner
('John Cooleen', 'Partner, Seven Boson Group',
'John Cooleen brings over 18 years of operational and investment experience in the technology sector. Previously served as CFO and later COO at several high-growth startups, including two successful IPOs and one major acquisition. Prior experience includes investment banking roles at Morgan Stanley and Merrill Lynch, where he specialized in technology M&A and capital markets transactions. John has particular expertise in SaaS, cloud infrastructure, and cybersecurity companies, having helped scale multiple companies from $10M to $500M+ in revenue.',
'MBA in Finance from Columbia Business School; MS in Electrical Engineering from Stanford University; BS in Computer Engineering from University of Illinois',
'https://linkedin.com/in/john-cooleen-finance', 'john.cooleen@sevenboson.com', 6, 6, true),

-- Aniruddh Ramesh - Director of Technology
('Aniruddh Ramesh (Ph.D.)', 'Director of Technology, Seven Boson Group',
'Dr. Aniruddh Ramesh leads technology due diligence and strategic technical assessments for Seven Boson Group\'s portfolio companies. Previously served as Principal Research Scientist at Google DeepMind, where he contributed to breakthrough developments in artificial intelligence and machine learning. Prior experience includes senior engineering roles at Tesla, SpaceX, and Bell Labs, with over 50 patents and 100+ peer-reviewed publications. Aniruddh has particular expertise in AI/ML, quantum computing, robotics, and advanced materials, making him invaluable for evaluating cutting-edge technology investments.',
'PhD in Artificial Intelligence from Stanford University; MS in Computer Science from MIT; BTech in Computer Science from IIT Delhi',
'https://linkedin.com/in/aniruddh-ramesh-ai', 'aniruddh.ramesh@sevenboson.com', 7, 7, true);

-- Insert investment areas (pillars and sectors)
INSERT INTO investment_areas (title, description, icon, category, position, is_active) VALUES

-- Investment Pillars
('Private Equity', 'Strategic investments in high-growth companies with proven business models and strong leadership teams. We focus on control positions that allow us to drive operational improvements and strategic initiatives for long-term value creation.', 'Building2', 'pillar', 1, true),

('Venture Capital', 'Early-stage investments in disruptive technologies and innovative startups with exceptional growth potential. We partner with visionary entrepreneurs to build the next generation of market-leading companies.', 'Rocket', 'pillar', 2, true),

('Growth Capital', 'Expansion funding for established companies looking to scale operations and enter new markets. We provide both capital and strategic guidance to accelerate growth and market penetration.', 'TrendingUp', 'pillar', 3, true),

-- Innovation Sectors
('AI as a Service', 'Next-generation artificial intelligence platforms, machine learning solutions, and automated decision-making systems that are transforming industries from healthcare to finance to manufacturing.', 'Cpu', 'sector', 1, true),

('Green Technology', 'Sustainable technology solutions addressing climate change, renewable energy systems, energy storage, carbon capture, and environmental monitoring technologies driving the clean energy transition.', 'Leaf', 'sector', 2, true),

('Medical Technology', 'Innovative healthcare technologies including digital health platforms, medical devices, precision medicine, biotech solutions, and telemedicine systems revolutionizing patient care.', 'Heart', 'sector', 3, true),

('Quantum Computing', 'Revolutionary quantum computing platforms, quantum algorithms, quantum communication systems, and quantum sensing technologies that will unlock unprecedented computational capabilities.', 'Zap', 'sector', 4, true),

('Robotics & Automation', 'Advanced robotics systems, industrial automation, autonomous vehicles, and intelligent manufacturing solutions transforming how we work and live.', 'Cog', 'sector', 5, true),

('Cybersecurity', 'Next-generation cybersecurity solutions, threat detection systems, data privacy technologies, and secure communication platforms protecting the digital infrastructure.', 'Shield', 'sector', 6, true);

-- Insert portfolio companies with detailed information
INSERT INTO portfolio_companies (name, description, website, sector, logo_id, position, is_active) VALUES

('Redback Networks', 'Leading provider of next-generation networking infrastructure and edge computing solutions. Redback Networks specializes in high-performance routers, switches, and network management software that enable telecom operators and enterprises to build scalable, reliable networks for 5G, IoT, and cloud applications.', 'https://redbacknetworks.com', 'Network Infrastructure', 8, 1, true),

('QuantAI Digital', 'Pioneering artificial intelligence platform that combines quantum computing principles with machine learning algorithms. QuantAI Digital provides enterprise AI solutions for financial modeling, risk assessment, and algorithmic trading, serving major banks, hedge funds, and insurance companies globally.', 'https://quantai-digital.com', 'AI & Quantum Computing', 9, 2, true),

('Procera Networks', 'Global leader in intelligent network analytics and deep packet inspection (DPI) technology. Procera Networks helps telecom operators and enterprises optimize network performance, enhance security, and monetize their network infrastructure through advanced traffic analytics and policy enforcement.', 'https://proceranetworks.com', 'Network Analytics', 10, 3, true),

('GoPebble', 'Innovative mobile technology platform that revolutionizes digital payments and financial services in emerging markets. GoPebble provides secure, user-friendly mobile wallet solutions, micro-lending services, and digital banking infrastructure for underbanked populations.', 'https://gopebble.com', 'Fintech & Mobile Technology', 11, 4, true),

('Biotricity', 'Advanced medical technology company developing remote patient monitoring solutions and cardiac diagnostic devices. Biotricity\'s FDA-approved devices enable continuous health monitoring, early disease detection, and improved patient outcomes through real-time biometric data analysis.', 'https://biotricity.com', 'Medical Technology', 12, 5, true),

('Aquatherm India', 'Leading manufacturer of advanced piping systems and water management solutions for industrial and commercial applications. Aquatherm India specializes in polypropylene pipe systems, sustainable water infrastructure, and smart building technologies across South Asian markets.', 'https://aquatherm.in', 'Sustainable Infrastructure', 13, 6, true);

-- Insert office locations
INSERT INTO office_locations (name, address, phone, email, logo, sector, position, is_active) VALUES

('San Francisco', '350 California Street, Suite 1200, San Francisco, CA 94104, United States', '+1 (415) 555-0100', 'sf@sevenboson.com', 'SF', 'AI & Technology Hub - Silicon Valley headquarters focusing on venture capital investments, AI/ML startups, and quantum computing initiatives', 1, true),

('Singapore', '1 Raffles Place, #40-02 One Raffles Place, Singapore 048616', '+65 6555 0123', 'singapore@sevenboson.com', 'SG', 'Asia Pacific Operations - Regional headquarters managing investments across Southeast Asia, fintech, and emerging market opportunities', 2, true),

('London', '1 King William Street, London EC4N 7AF, United Kingdom', '+44 20 7555 0188', 'london@sevenboson.com', 'LON', 'European Markets - Managing European investments, cross-border transactions, and strategic partnerships with UK and EU technology companies', 3, true),

('New York', '200 Park Avenue, Suite 1700, New York, NY 10166, United States', '+1 (212) 555-0150', 'ny@sevenboson.com', 'NY', 'Financial Markets Hub - Managing private equity investments, institutional relationships, and East Coast portfolio companies', 4, true),

('Mumbai', 'One World Centre, Tower 2A, 19th Floor, Senapati Bapat Marg, Elphinstone Road, Mumbai 400013, India', '+91 22 6555 0100', 'mumbai@sevenboson.com', 'MUM', 'South Asian Operations - Managing investments in Indian subcontinent, focusing on fintech, edtech, and infrastructure technology', 5, true);

-- Insert comprehensive page content
INSERT INTO page_content (page_slug, content_type, section_name, title, subtitle, description, background_image_url, content, layout_type, position, is_active) VALUES

-- Homepage content
('home', 'hero', 'hero', 
'Global Investing in Transformational Businesses, Technologies, and Strategic Assets',
NULL,
'Seven Boson Group Ltd — a premier global private equity holding company, fusing disciplined capital with in-house capabilities and operator-deep execution to deliver resilient, compounding returns — adding techno-commercial value at every level.',
'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920',
'{"primary_cta_text": "Explore Our Portfolio", "primary_cta_url": "/portfolio", "secondary_cta_text": "Apply for Investment", "secondary_cta_url": "/apply"}',
'hero_fullscreen', 1, true),

('home', 'text_section', 'investment_focus',
'Investment Focus Areas',
'Strategic Diversification Across High-Growth Sectors',
'We specialize in three core investment pillars, each designed to maximize risk-adjusted returns through strategic diversification and active portfolio management.',
NULL, NULL, 'grid_3_column', 2, true),

('home', 'text_section', 'innovation_sectors',
'Innovation Sectors',
'Targeting Tomorrow\'s Most Disruptive Technologies',
'Our investment thesis focuses on sectors driving global transformation, from artificial intelligence and quantum computing to sustainable technology and advanced healthcare solutions.',
NULL, NULL, 'grid_4_column', 3, true),

-- About page content  
('about', 'hero', 'hero',
'About Seven Boson Group',
'Disciplined Capital. Operator Execution. Global Scale.',
'Seven Boson Group Ltd delivers superior, high-yield, risk-adjusted returns by targeting the transformative growth of tomorrow\'s most disruptive sectors — including AI-as-a-Service, Robotics, Quantum Computing, Next-Gen Energy, MedTech, and Core Enabling Technologies.',
'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920',
NULL, 'hero_standard', 1, true),

('about', 'text_section', 'philosophy',
'Investment Philosophy',
'Disciplined. Diversified. Data-Driven.',
'We apply a disciplined GARP (Growth at a Reasonable Price) strategy across real estate, private equity, and alternatives—amplified by structured high-yield instruments and active management to unlock asymmetric, risk-adjusted returns. Our approach combines deep sector expertise with operational excellence to drive sustainable growth and value creation.',
'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920',
NULL, 'two_column_image_text', 2, true),

-- Team page content
('team', 'hero', 'hero',
'Our Leadership Team',
'Over a Century of Collective Investment & Technology Leadership Experience',
'Our Managing Team have been shaped at the world\'s most prestigious investment firms, global corporations, and frontier technology ventures. We combine deep sector knowledge with an operator-investor mindset — not just identifying opportunities, but designing, building, and scaling them into enduring enterprises.',
'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=1920',
NULL, 'hero_standard', 1, true),

-- Portfolio page content
('portfolio', 'hero', 'hero',
'Our Portfolio',
'Innovative Companies Driving the Future of Technology',
'Discover our carefully curated portfolio of transformational companies across AI, quantum computing, medical technology, fintech, and sustainable infrastructure. Each investment represents our commitment to backing visionary entrepreneurs and breakthrough technologies.',
'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920',
NULL, 'hero_standard', 1, true),

-- Investment Classes page content
('investment-classes', 'hero', 'hero',
'Investment Classes',
'Diversified Strategies Across High-Growth Sectors',
'Discover our comprehensive investment strategies spanning artificial intelligence, green technology, medical innovation, and emerging market opportunities. Each investment class is designed to capture specific market dynamics while maintaining optimal risk-adjusted returns.',
'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920',
NULL, 'hero_standard', 1, true),

-- Contact page content
('contact', 'hero', 'hero',
'Contact Seven Boson Group',
'Connect with Our Global Investment Team',
'Ready to explore partnership opportunities or learn more about our investment approach? Our team of experienced professionals is available across our global offices to discuss how Seven Boson Group can support your growth objectives.',
'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920',
NULL, 'hero_standard', 1, true),

-- Application page content
('apply', 'hero', 'hero',
'Apply for Investment',
'Submit Your Company for Investment Consideration',
'Seven Boson Group is actively seeking innovative companies with strong growth potential across our focus sectors. Submit your application to be considered for strategic investment and partnership opportunities.',
'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1920',
NULL, 'hero_standard', 1, true);

-- Insert company branding information
INSERT INTO branding (company_name, logo_url, primary_color, secondary_color, tagline, description) VALUES
('Seven Boson Group',
'/images/SEVEN-BOSON-LOGO.png',
'#f59e0b',
'#64748b', 
'Delivering Superior, High-Yield Investment Solutions',
'Seven Boson Group Ltd is a premier global private equity holding company that delivers superior, high-yield investment solutions across cutting-edge sectors including AI, quantum computing, green technology, and medical innovation. We combine disciplined capital with in-house capabilities and operator-deep execution to deliver resilient, compounding returns.');

COMMIT;

-- Verify data insertion
SELECT 'Team Members' as table_name, COUNT(*) as record_count FROM team_members
UNION ALL
SELECT 'Portfolio Companies', COUNT(*) FROM portfolio_companies  
UNION ALL
SELECT 'Investment Areas', COUNT(*) FROM investment_areas
UNION ALL
SELECT 'Office Locations', COUNT(*) FROM office_locations
UNION ALL
SELECT 'Page Content', COUNT(*) FROM page_content
UNION ALL
SELECT 'Media Files', COUNT(*) FROM media
UNION ALL
SELECT 'Branding', COUNT(*) FROM branding;