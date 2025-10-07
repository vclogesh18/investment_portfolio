--
-- PostgreSQL database dump
--

\restrict HtXXG0Oc1L0COTz6ZiAG0EDGKYxqc5KzMVF289DFN1gBBxReCyzVgTUA7Us1gQ4

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.admin_users VALUES (1, 'admin@sevenboson.com', '$2a$10$RM1HdjjcT5h9SgtvZRKGSuS.4ew4iMjBbsV6EtGwjMtq0LvEIGQ2e', 'admin', true, '2025-10-06 22:05:14.366888', '2025-10-04 02:38:12.018535', '2025-10-04 02:38:12.018535');


--
-- Data for Name: blog_categories; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.blog_categories VALUES (1, 'Technology', 'technology', 'Latest technology trends and innovations', '#2196F3', true, '2025-10-04 20:49:04.271572', '2025-10-04 20:49:04.271572');
INSERT INTO public.blog_categories VALUES (2, 'Investment Insights', 'investment-insights', 'Market analysis and investment strategies', '#4CAF50', true, '2025-10-04 20:49:04.271572', '2025-10-04 20:49:04.271572');
INSERT INTO public.blog_categories VALUES (3, 'Company Updates', 'company-updates', 'News and updates from Seven Boson Group', '#FF9800', true, '2025-10-04 20:49:04.271572', '2025-10-04 20:49:04.271572');
INSERT INTO public.blog_categories VALUES (4, 'Industry Analysis', 'industry-analysis', 'Deep dive into various industries we invest in', '#9C27B0', true, '2025-10-04 20:49:04.271572', '2025-10-04 20:49:04.271572');
INSERT INTO public.blog_categories VALUES (5, 'AI & Machine Learning', 'ai-machine-learning', 'Artificial Intelligence and ML developments', '#F44336', true, '2025-10-04 20:49:04.271572', '2025-10-04 20:49:04.271572');
INSERT INTO public.blog_categories VALUES (6, 'Green Technology', 'green-technology', 'Sustainable and clean technology investments', '#8BC34A', true, '2025-10-04 20:49:04.271572', '2025-10-04 20:49:04.271572');
INSERT INTO public.blog_categories VALUES (7, 'Healthcare Innovation', 'healthcare-innovation', 'Medical technology and healthcare advancements', '#00BCD4', true, '2025-10-04 20:49:04.271572', '2025-10-04 20:49:04.271572');


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.blog_posts VALUES (2, 'Sustainable Technology: The Next Trillion-Dollar Investment Opportunity', 'sustainable-technology-trillion-dollar-investment-opportunity', '<h2>Green Technology is Creating Unprecedented Investment Returns</h2>
    <p>The global shift toward sustainability is not just an environmental imperative—it''s the largest economic opportunity of our generation.</p>
    
    <h3>Market Size and Growth Projections</h3>
    <p>The sustainable technology market is projected to reach $2.5 trillion by 2030, with annual growth rates exceeding 15% across multiple sectors including:</p>
    
    <ul>
      <li>Renewable Energy Storage</li>
      <li>Carbon Capture Technologies</li>
      <li>Smart Grid Infrastructure</li>
      <li>Sustainable Materials</li>
      <li>Clean Transportation</li>
    </ul>
    
    <h3>Seven Boson Group''s Green Tech Portfolio</h3>
    <p>Our dedicated Green Technology fund has achieved remarkable results:</p>
    <ul>
      <li>35% average annual returns over the past 3 years</li>
      <li>$500M invested across 42 sustainable technology companies</li>
      <li>3 successful exits with 10x+ returns</li>
    </ul>
    
    <p>We''re particularly excited about our recent investments in breakthrough battery technology and next-generation solar panel efficiency improvements.</p>', 'Discover why sustainable technology represents the next trillion-dollar investment opportunity and how Seven Boson Group is leading the charge.', NULL, 'Explore sustainable technology investment opportunities. Learn about green tech market projections and Seven Boson Group''s successful portfolio.', 'sustainable technology investment, green tech portfolio, renewable energy investing, clean technology fund', 'Green Technology Team', 'greentech@sevenbosongroup.com', 6, 0, true, true, '2025-09-29 20:49:04.272632', '2025-10-04 20:49:04.272632', '2025-10-04 20:49:04.272632');
INSERT INTO public.blog_posts VALUES (3, 'Digital Health Revolution: Investing in the Future of Healthcare', 'digital-health-revolution-investing-future-healthcare', '<h2>Healthcare Technology is Transforming Patient Outcomes</h2>
    <p>The convergence of digital technology and healthcare is creating innovative solutions that improve patient outcomes while reducing costs.</p>
    
    <h3>Key Investment Areas</h3>
    <p>Our healthcare technology investments focus on four critical areas:</p>
    
    <h4>1. Telemedicine Platforms</h4>
    <p>Remote healthcare delivery has grown 3800% since 2020, creating massive opportunities for scalable technology solutions.</p>
    
    <h4>2. AI-Powered Diagnostics</h4>
    <p>Machine learning algorithms can now detect diseases earlier and more accurately than traditional methods, potentially saving millions of lives.</p>
    
    <h4>3. Wearable Health Monitoring</h4>
    <p>Continuous health monitoring devices are becoming increasingly sophisticated, providing real-time insights into patient health.</p>
    
    <h4>4. Drug Discovery Technology</h4>
    <p>AI-accelerated drug discovery is reducing development timelines from 10-15 years to 3-5 years, dramatically improving ROI for pharmaceutical investments.</p>
    
    <p>Seven Boson Group has invested $300M in digital health companies, with an average portfolio company valuation increase of 340% over 18 months.</p>', 'Explore the digital health revolution and discover how healthcare technology investments are transforming patient care and generating superior returns.', NULL, 'Learn about digital health investment opportunities in telemedicine, AI diagnostics, wearable monitoring, and drug discovery technology.', 'digital health investing, healthcare technology, telemedicine investment, AI diagnostics, wearable health tech', 'Healthcare Investment Team', 'healthcare@sevenbosongroup.com', 7, 0, false, true, '2025-09-27 20:49:04.272632', '2025-10-04 20:49:04.272632', '2025-10-04 20:49:04.272632');
INSERT INTO public.blog_posts VALUES (1, 'The Future of AI in Private Equity Investment Decisions', 'future-ai-private-equity-investment-decisions', '<h2>Artificial Intelligence is Revolutionizing Investment Analysis</h2>
    <p>The private equity landscape is undergoing a fundamental transformation as artificial intelligence becomes increasingly sophisticated in analyzing market trends, company performance, and investment opportunities.</p>
    
    <h3>Key Areas of AI Implementation</h3>
    <ul>
      <li><strong>Due Diligence Automation:</strong> AI systems can now process thousands of documents in minutes, identifying key risk factors and opportunities that might take human analysts weeks to uncover.</li>
      <li><strong>Market Prediction Models:</strong> Machine learning algorithms analyze historical data patterns to predict market movements with unprecedented accuracy.</li>
      <li><strong>Portfolio Optimization:</strong> AI-driven portfolio management ensures optimal asset allocation based on real-time market conditions.</li>
    </ul>
    
    <p>At Seven Boson Group, we''ve integrated cutting-edge AI tools into our investment process, resulting in a 23% improvement in portfolio performance over traditional methods.</p>
    
    <blockquote>
      "AI doesn''t replace human judgment—it amplifies our analytical capabilities, allowing us to make more informed decisions faster than ever before." - Investment Team Lead
    </blockquote>
    
    <h3>Looking Ahead</h3>
    <p>As we continue to refine our AI-driven investment strategies, we''re seeing new opportunities emerge in sectors previously considered too complex or volatile for traditional analysis methods.</p>', 'Explore how artificial intelligence is transforming private equity investment decisions and driving superior portfolio performance at Seven Boson Group.', NULL, 'Discover how AI is revolutionizing private equity investments. Learn about AI-driven due diligence, market prediction, and portfolio optimization strategies.', 'AI private equity, artificial intelligence investing, machine learning finance, investment technology, portfolio optimization', 'Seven Boson Investment Team', 'investments@sevenbosongroup.com', 8, 8, true, true, '2025-10-02 20:49:04.272632', '2025-10-04 20:49:04.272632', '2025-10-04 22:53:01.449392');
INSERT INTO public.blog_posts VALUES (5, 'Test Blog Post from API', 'test-blog-post-from-api', '<h2>This is a test post</h2><p>Created via the REST API to demonstrate the blog system functionality.</p>', 'A test blog post to demonstrate API functionality', NULL, NULL, NULL, 'API Test', NULL, 1, 0, false, true, '2025-10-04 22:47:23.514', '2025-10-04 22:47:23.514862', '2025-10-04 22:47:23.514862');


--
-- Data for Name: blog_post_categories; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.blog_post_categories VALUES (1, 1, 1, '2025-10-04 20:49:04.273716');
INSERT INTO public.blog_post_categories VALUES (2, 1, 5, '2025-10-04 20:49:04.273716');
INSERT INTO public.blog_post_categories VALUES (3, 1, 2, '2025-10-04 20:49:04.273716');
INSERT INTO public.blog_post_categories VALUES (4, 2, 1, '2025-10-04 20:49:04.273716');
INSERT INTO public.blog_post_categories VALUES (5, 2, 6, '2025-10-04 20:49:04.273716');
INSERT INTO public.blog_post_categories VALUES (6, 2, 2, '2025-10-04 20:49:04.273716');
INSERT INTO public.blog_post_categories VALUES (7, 3, 1, '2025-10-04 20:49:04.273716');
INSERT INTO public.blog_post_categories VALUES (8, 3, 7, '2025-10-04 20:49:04.273716');
INSERT INTO public.blog_post_categories VALUES (9, 3, 2, '2025-10-04 20:49:04.273716');
INSERT INTO public.blog_post_categories VALUES (11, 5, 1, '2025-10-04 22:47:23.518021');
INSERT INTO public.blog_post_categories VALUES (12, 5, 2, '2025-10-04 22:47:23.518021');


--
-- Data for Name: branding; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.branding VALUES (1, 'Seven Boson Group', NULL, '#f59e0b', '#64748b', 'Delivering superior, high-yield investment solutions', 'Seven Boson Group Ltd delivers superior, high-yield investment solutions across cutting-edge sectors including AI, quantum computing, green technology, and medical innovation.', '2025-10-06 22:01:49.539052', '2025-10-06 22:01:49.539052');


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.media VALUES (2, 'Benoy-Varghese.png', 'Benoy-Varghese.png', '/images/teams/Benoy-Varghese.png', NULL, 'image/png', 'Benoy Varghese - Managing Partner', 'team', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (3, 'Chris-Jarrous.png', 'Chris-Jarrous.png', '/images/teams/Chris-Jarrous.png', NULL, 'image/png', 'Chris Jarrous - Managing Partner', 'team', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (4, 'Jay-Amaran.png', 'Jay-Amaran.png', '/images/teams/Jay-Amaran.png', NULL, 'image/png', 'Jay Amaran - Director of Education and Government services', 'team', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (5, 'John-Cooleen.png', 'John-Cooleen.png', '/images/teams/John-Cooleen.png', NULL, 'image/png', 'John Cooleen - Partner', 'team', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (6, 'Ramesh-Santhanam.jpeg', 'Ramesh-Santhanam.jpeg', '/images/teams/Ramesh-Santhanam.jpeg', NULL, 'image/jpeg', 'Ramesh Santhanam - Managing Partner', 'team', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (7, 'Aniruddh-Ramesh.jpg', 'Aniruddh-Ramesh.jpg', '/images/teams/Aniruddh-Ramesh.jpg', NULL, 'image/jpeg', 'Aniruddh Ramesh - Director of Technology', 'team', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (8, 'Redback_Networks.svg', 'Redback_Networks.svg', '/images/Redback_Networks.svg', NULL, 'image/svg+xml', 'Redback Networks logo', 'portfolio', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (9, 'Procera.png', 'Procera.png', '/images/Procera.png', NULL, 'image/png', 'Procera logo', 'portfolio', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (10, 'QuantAI-Digitial-logo.png', 'QuantAI-Digitial-logo.png', '/images/QuantAI-Digitial-logo.png', NULL, 'image/png', 'QuantAI Digital logo', 'portfolio', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (11, 'gopebble.png', 'gopebble.png', '/images/gopebble.png', NULL, 'image/png', 'GoPebble logo', 'portfolio', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (12, 'Biotricity.png', 'Biotricity.png', '/images/Biotricity.png', NULL, 'image/png', 'Biotricity logo', 'portfolio', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (13, 'Telaverge.jpeg', 'Telaverge.jpeg', '/images/Telaverge.jpeg', NULL, 'image/jpeg', 'Telaverge logo', 'portfolio', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (14, 'aquathermindia.jpeg', 'aquathermindia.jpeg', '/images/aquathermindia.jpeg', NULL, 'image/jpeg', 'Aquatherm India logo', 'portfolio', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (15, 'zerocode.jpeg', 'zerocode.jpeg', '/images/zerocode.jpeg', NULL, 'image/jpeg', 'ZeroCode logo', 'portfolio', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (16, 'SEVEN-BOSON-LOGO.png', 'SEVEN-BOSON-LOGO.png', '/images/SEVEN-BOSON-LOGO.png', NULL, 'image/png', 'Seven Boson Group logo', 'brand', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (17, 'Seven-Boson-tech.png', 'Seven-Boson-tech.png', '/images/Seven-Boson-tech.png', NULL, 'image/png', 'Seven Boson tech logo', 'brand', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (18, 'Artificial-Intelligence.jpeg', 'Artificial-Intelligence.jpeg', '/images/investment-classes/Artificial-Intelligence.jpeg', NULL, 'image/jpeg', 'Artificial Intelligence investment focus', 'investment-classes', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (19, 'Innovation-inv.jpeg', 'Innovation-inv.jpeg', '/images/investment-classes/Innovation-inv.jpeg', NULL, 'image/jpeg', 'Innovation investment focus', 'investment-classes', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (20, 'ai_dynamic_scaling_data_center.png', 'ai_dynamic_scaling_data_center.png', '/images/investment-classes/ai_dynamic_scaling_data_center.png', NULL, 'image/png', 'AI dynamic scaling data center', 'investment-classes', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (21, 'hero-home-bg.jpeg', 'business-meeting-background', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920', NULL, 'image/jpeg', 'Business meeting background', 'hero-backgrounds', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (22, 'hero-contact-bg.jpeg', 'office-building-background', 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1920', NULL, 'image/jpeg', 'Office building background', 'hero-backgrounds', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (23, 'hero-apply-bg.jpeg', 'team-collaboration-background', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920', NULL, 'image/jpeg', 'Team collaboration background', 'hero-backgrounds', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (24, 'hero-portfolio-bg.jpeg', 'investment-background', 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1920', NULL, 'image/jpeg', 'Investment portfolio background', 'hero-backgrounds', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (25, 'hero-about-bg.jpeg', 'corporate-office-background', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920', NULL, 'image/jpeg', 'Corporate office background', 'hero-backgrounds', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (26, 'investment-ai-bg.jpeg', 'ai-technology-background', 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=800', NULL, 'image/jpeg', 'AI technology background', 'hero-backgrounds', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (27, 'investment-green-bg.jpeg', 'green-technology-background', 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800', NULL, 'image/jpeg', 'Green technology background', 'hero-backgrounds', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (28, 'about-values-bg.jpeg', 'corporate-values-background', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800', NULL, 'image/jpeg', 'Corporate values background', 'hero-backgrounds', '2025-10-04 12:29:55.231937', '2025-10-04 12:29:55.231937');
INSERT INTO public.media VALUES (1, 'Chet-White.png', 'Chet-White.png', '/images/teams/Chet-White.png', NULL, 'image/png', 'Chet White - Managing General Partner', 'team', '2025-10-04 12:29:55.231937', '2025-10-04 12:38:42.7062');
INSERT INTO public.media VALUES (29, 'file-1759562701294-410614276.jpeg', 'Empowering businesses.jpeg', 'file-1759562701294-410614276.jpeg', 333634, 'image/jpeg', '', 'brand', '2025-10-04 12:55:01.298631', '2025-10-04 12:55:01.298631');


--
-- Data for Name: branding_settings; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.branding_settings VALUES (1, 'company_name', 'Seven Boson Group Ltd', NULL, 'Company name displayed in header and footer', true, '2025-10-04 14:23:52.351243', '2025-10-04 14:23:52.351243');
INSERT INTO public.branding_settings VALUES (3, 'footer_tagline', 'Join Us in Shaping the Future', NULL, 'Main tagline in footer', true, '2025-10-04 14:23:52.351243', '2025-10-04 14:23:52.351243');
INSERT INTO public.branding_settings VALUES (4, 'footer_description', 'If you''re driven to invest in high-yield, world-class assets with transformational potential, we invite you to explore our portfolio, connect with our leadership, and discover how Seven Boson Group Ltd can help you unlock exceptional value.', NULL, 'Footer description text', true, '2025-10-04 14:23:52.351243', '2025-10-04 14:23:52.351243');
INSERT INTO public.branding_settings VALUES (5, 'footer_copyright', '© 2025 Seven Boson Group Ltd. All rights reserved.', NULL, 'Copyright text in footer', true, '2025-10-04 14:23:52.351243', '2025-10-04 14:23:52.351243');
INSERT INTO public.branding_settings VALUES (6, 'contact_address', '4 W. 4th Street, San Mateo, California', NULL, 'Company address', true, '2025-10-04 14:23:52.351243', '2025-10-04 14:23:52.351243');
INSERT INTO public.branding_settings VALUES (7, 'contact_email', 'chet.white@sevenbosongroup.com', NULL, 'Primary contact email', true, '2025-10-04 14:23:52.351243', '2025-10-04 14:23:52.351243');
INSERT INTO public.branding_settings VALUES (8, 'contact_phone', '+1 (415) 940-1476', NULL, 'Primary contact phone', true, '2025-10-04 14:23:52.351243', '2025-10-04 14:23:52.351243');
INSERT INTO public.branding_settings VALUES (9, 'contact_phone_secondary', '+91 984-144-5136', NULL, 'Secondary contact phone', true, '2025-10-04 14:23:52.351243', '2025-10-04 14:23:52.351243');
INSERT INTO public.branding_settings VALUES (10, 'linkedin_url', 'https://www.linkedin.com/company/seven-boson-group', NULL, 'LinkedIn profile URL', true, '2025-10-04 14:23:52.351243', '2025-10-04 14:23:52.351243');
INSERT INTO public.branding_settings VALUES (2, 'logo_alt_text', 'Seven Boson Group logo', 16, 'Alt text for the company logo', true, '2025-10-04 14:23:52.351243', '2025-10-04 14:49:36.522023');


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.pages VALUES (1, 'home', 'Home', 'Seven Boson Group Ltd delivers superior, high-yield returns through strategic private equity investments.', 'Innovative Investment Solutions', 'Seven Boson Group Ltd delivers superior, high-yield returns through strategic private equity investments across emerging technology sectors.', NULL, 'published', 'home', '2025-10-04 02:38:12.02058', '2025-10-04 02:38:12.02058', NULL, NULL, NULL, NULL);
INSERT INTO public.pages VALUES (2, 'about', 'About Seven Boson Group', 'Learn about Seven Boson Group Ltd, a premier global private equity holding company focused on disruptive innovation and strategic investments.', 'About Seven Boson Group', 'Seven Boson Group Ltd delivers superior, high-yield returns through strategic private equity investments across emerging technology sectors.', NULL, 'published', 'about', '2025-10-04 02:38:12.021875', '2025-10-04 07:26:50.77801', NULL, NULL, NULL, NULL);
INSERT INTO public.pages VALUES (7, 'contact', 'Contact Us', 'Get in touch with Seven Boson Group. Contact our global offices in New York, London, and Singapore for investment opportunities.', NULL, NULL, NULL, 'published', 'contact', '2025-10-04 07:26:50.77801', '2025-10-04 07:26:50.77801', NULL, NULL, NULL, NULL);
INSERT INTO public.pages VALUES (4, 'portfolio', 'Portfolio', 'Explore Seven Boson Group''s portfolio of innovative companies across AI, MedTech, Quantum Computing, and other transformative sectors.', 'Our Portfolio', 'Innovative companies driving the future of technology', NULL, 'published', 'portfolio', '2025-10-04 02:38:12.022745', '2025-10-04 07:26:50.77801', NULL, NULL, NULL, NULL);
INSERT INTO public.pages VALUES (9, 'apply', 'Apply for Funding', 'Submit your funding application to Seven Boson Group. We invest in transformational companies with innovative solutions.', NULL, NULL, NULL, 'published', 'apply', '2025-10-04 07:26:50.77801', '2025-10-04 07:26:50.77801', NULL, NULL, NULL, NULL);
INSERT INTO public.pages VALUES (3, 'investment-classes', 'Investment Classes', 'Discover our diversified investment classes spanning strategic assets, private equity, and alternative investments.', 'Investment Classes', 'Diversified portfolio across high-growth technology sectors', NULL, 'published', 'investment-classes', '2025-10-04 02:38:12.022449', '2025-10-04 07:26:50.77801', NULL, NULL, NULL, NULL);
INSERT INTO public.pages VALUES (5, 'team', 'Our Team', 'Meet the experienced team behind Seven Boson Group''s investment success and strategic partnerships.', 'Our Team Members', 'Meet the experienced professionals behind Seven Boson Group''s investment success and strategic vision.', NULL, 'published', 'team', '2025-10-04 02:38:12.022941', '2025-10-04 11:56:54.024459', NULL, NULL, NULL, NULL);


--
-- Data for Name: content_blocks; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--



--
-- Data for Name: footer_links; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.footer_links VALUES (1, 'About Us', '/about', false, 1, true, '2025-10-04 14:23:52.355279', '2025-10-04 14:23:52.355279');
INSERT INTO public.footer_links VALUES (2, 'Investment Classes', '/investment-classes', false, 2, true, '2025-10-04 14:23:52.355279', '2025-10-04 14:23:52.355279');
INSERT INTO public.footer_links VALUES (3, 'Portfolio', '/portfolio', false, 3, true, '2025-10-04 14:23:52.355279', '2025-10-04 14:23:52.355279');
INSERT INTO public.footer_links VALUES (4, 'Our Team', '/team', false, 4, true, '2025-10-04 14:23:52.355279', '2025-10-04 14:23:52.355279');
INSERT INTO public.footer_links VALUES (5, 'Apply', '/apply', false, 5, true, '2025-10-04 14:23:52.355279', '2025-10-04 14:23:52.355279');
INSERT INTO public.footer_links VALUES (6, 'Contact', '/contact', false, 6, true, '2025-10-04 14:23:52.355279', '2025-10-04 14:23:52.355279');


--
-- Data for Name: form_configs; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--



--
-- Data for Name: investment_areas; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.investment_areas VALUES (2, 'Strategic Tech Mergers, Acquisitions & Takeovers', 'Specialized in structuring and executing innovative transactions, driving consolidation, control, and long-term value creation for our focus areas, across strategic assets.', 'TrendingUp', 'pillar', 1, true, '2025-10-04 02:58:42.211958', '2025-10-04 02:58:42.211958');
INSERT INTO public.investment_areas VALUES (3, 'Alternatives', 'Cutting-edge technology investments in AI, quantum computing, and disruptive innovations.', 'Lightbulb', 'pillar', 2, true, '2025-10-04 02:58:42.212442', '2025-10-04 02:58:42.212442');
INSERT INTO public.investment_areas VALUES (4, 'AI as a Service', 'Next-generation artificial intelligence platforms', 'Cpu', 'sector', 0, true, '2025-10-04 02:58:42.213048', '2025-10-04 02:58:42.213048');
INSERT INTO public.investment_areas VALUES (5, 'MedTech', 'Revolutionary healthcare technologies', 'Activity', 'sector', 1, true, '2025-10-04 02:58:42.213485', '2025-10-04 02:58:42.213485');
INSERT INTO public.investment_areas VALUES (6, 'GreenTech', 'Sustainable energy solutions', 'Leaf', 'sector', 2, true, '2025-10-04 02:58:42.213782', '2025-10-04 02:58:42.213782');
INSERT INTO public.investment_areas VALUES (7, 'Quantum Computing', 'Quantum computational technologies', 'Globe', 'sector', 3, true, '2025-10-04 02:58:42.213949', '2025-10-04 02:58:42.213949');
INSERT INTO public.investment_areas VALUES (8, 'Private Equity', 'Strategic investments in high-growth companies with proven business models and strong leadership teams.', 'Building2', 'pillar', 0, true, '2025-10-04 11:48:09.325259', '2025-10-04 11:48:09.325259');
INSERT INTO public.investment_areas VALUES (9, 'Venture Capital', 'Early-stage investments in disruptive technologies and innovative startups with exceptional growth potential.', 'Rocket', 'pillar', 1, true, '2025-10-04 11:48:09.326409', '2025-10-04 11:48:09.326409');
INSERT INTO public.investment_areas VALUES (10, 'Growth Capital', 'Expansion funding for established companies looking to scale operations and enter new markets.', 'TrendingUp', 'pillar', 2, true, '2025-10-04 11:48:09.32669', '2025-10-04 11:48:09.32669');
INSERT INTO public.investment_areas VALUES (11, 'AI as a Service', 'Next-generation artificial intelligence platforms and machine learning solutions.', 'Cpu', 'sector', 0, true, '2025-10-04 11:48:09.326943', '2025-10-04 11:48:09.326943');
INSERT INTO public.investment_areas VALUES (12, 'Green Technology', 'Sustainable technology solutions for environmental challenges and clean energy.', 'Leaf', 'sector', 1, true, '2025-10-04 11:48:09.327187', '2025-10-04 11:48:09.327187');
INSERT INTO public.investment_areas VALUES (13, 'Medical Technology', 'Innovative healthcare technologies and medical device companies.', 'Heart', 'sector', 2, true, '2025-10-04 11:48:09.3275', '2025-10-04 11:48:09.3275');
INSERT INTO public.investment_areas VALUES (14, 'Quantum Computing', 'Revolutionary quantum computing platforms and quantum technology applications.', 'Zap', 'sector', 3, true, '2025-10-04 11:48:09.327873', '2025-10-04 11:48:09.327873');
INSERT INTO public.investment_areas VALUES (1, 'Private Equity', 'Strategic investments in transformational businesses with exceptional growth potential.', 'Building2', 'pillar', 0, true, '2025-10-04 02:58:42.211457', '2025-10-04 12:20:35.202627');


--
-- Data for Name: office_locations; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.office_locations VALUES (1, 'San Francisco', '350 California Street, San Francisco, CA 94104', '+1 (415) 555-0123', 'sf@sevenboson.com', 'SF', 'AI & Technology Hub', 0, true, '2025-10-04 02:38:12.028412', '2025-10-04 02:38:12.028412');
INSERT INTO public.office_locations VALUES (2, 'Singapore', '1 Raffles Place, Singapore 048616', '+65 6555 0123', 'sg@sevenboson.com', 'SG', 'Asia Pacific Operations', 1, true, '2025-10-04 02:38:12.029206', '2025-10-04 02:38:12.029206');
INSERT INTO public.office_locations VALUES (3, 'London', '1 King William Street, London EC4N 7AF, UK', '+44 20 7555 0123', 'london@sevenboson.com', 'LON', 'European Markets', 2, true, '2025-10-04 02:38:12.029649', '2025-10-04 02:38:12.029649');
INSERT INTO public.office_locations VALUES (4, 'San Francisco', '350 California Street, San Francisco, CA 94104', '+1 (415) 555-0123', 'sf@sevenboson.com', 'SF', 'AI & Technology Hub', 0, true, '2025-10-04 11:48:09.328219', '2025-10-04 11:48:09.328219');
INSERT INTO public.office_locations VALUES (5, 'Singapore', '1 Raffles Place, Singapore 048616', '+65 6555 0123', 'sg@sevenboson.com', 'SG', 'Asia Pacific Operations', 1, true, '2025-10-04 11:48:09.328844', '2025-10-04 11:48:09.328844');
INSERT INTO public.office_locations VALUES (6, 'London', '1 King William Street, London EC4N 7AF, UK', '+44 20 7555 0123', 'london@sevenboson.com', 'LON', 'European Markets', 2, true, '2025-10-04 11:48:09.329201', '2025-10-04 11:48:09.329201');


--
-- Data for Name: page_content; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.page_content VALUES (33, 'investment-classes', 'hero', 'hero', 'Investment Classes', NULL, 'Discover our diversified investment classes spanning strategic assets, private equity, and alternative investments across the most promising sectors.', NULL, 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920', NULL, NULL, NULL, 0, true, '2025-10-04 07:56:37.99572', '2025-10-04 07:56:37.99572');
INSERT INTO public.page_content VALUES (27, 'about', 'hero', 'hero', 'About Seven Boson Group', '', 'Seven Boson Group Ltd delivers superior, high-yield, risk-adjusted returns by targeting the transformative growth of tomorrow''s most disruptive sectors — including AI-as-a-Service, Robotics, Quantum Computing, Next-Gen Energy, MedTech, and Core Enabling Technologies.', '{}', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920', '', '', NULL, 0, true, '2025-10-04 07:56:37.99572', '2025-10-04 08:28:08.149841');
INSERT INTO public.page_content VALUES (31, 'portfolio', 'hero', 'hero', 'Portfolio Companiesss', '', 'Explore our diverse portfolio of innovative companies across transformative sectors', '{}', 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1920', '', '', NULL, 0, true, '2025-10-04 07:56:37.99572', '2025-10-04 09:24:53.663618');
INSERT INTO public.page_content VALUES (24, 'home', 'hero', 'hero', 'Global Investing
in Transformational Businesses, Technologies, and Strategic Assets', '', 'Seven Boson Group Ltd — a premier global private equity holding company, fusing disciplined capital with in-house capabilities and operator-deep execution to deliver resilient, compounding returns — adding techno-commercial value at every level.', '{}', '', '', '', NULL, 0, true, '2025-10-04 07:56:37.99572', '2025-10-04 15:08:45.329125');
INSERT INTO public.page_content VALUES (26, 'home', 'text_section', 'innovation_sectors', 'Innovation Sectors', '', 'Targeting the most promising sectors driving global transformation.', '{}', '', NULL, NULL, 'grid', 2, true, '2025-10-04 07:56:37.99572', '2025-10-04 08:08:40.908258');
INSERT INTO public.page_content VALUES (32, 'apply', 'hero', 'hero', 'Apply for Funding', '', 'Are you building a transformational company? We''re looking for exceptional entrepreneurs with innovative solutions that have the potential to reshape industries.', '{}', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920', '', '', NULL, 0, true, '2025-10-04 07:56:37.99572', '2025-10-04 12:09:56.956307');
INSERT INTO public.page_content VALUES (25, 'home', 'text_section', 'investment_focus', 'Investment Focus Areas', '', 'We specialize in three core investment pillars, each designed to maximize risk-adjusted returns through strategic diversification.', '{}', '', NULL, NULL, 'grid', 1, true, '2025-10-04 07:56:37.99572', '2025-10-04 12:17:01.617783');
INSERT INTO public.page_content VALUES (28, 'about', 'text_section', 'philosophy', 'Disciplined. Diversified. Data-Driven', '', 'We apply a disciplined GARP strategy across real estate, private equity, and alternatives—amplified by structured high-yield instruments and active management to unlock asymmetric, risk-adjusted returns.', '{}', '', NULL, NULL, 'two_column', 1, true, '2025-10-04 07:56:37.99572', '2025-10-04 12:17:16.912145');
INSERT INTO public.page_content VALUES (30, 'contact', 'hero', 'hero', 'Get in Touch With Us', '', 'Ready to explore investment opportunities or discuss partnership possibilities? Our team is here to help you navigate your next strategic move.', '{}', 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1920', '', '', NULL, 0, true, '2025-10-04 07:56:37.99572', '2025-10-04 11:58:25.254871');
INSERT INTO public.page_content VALUES (35, 'about', 'features', 'global_offices', 'Global Presence', '', 'Strategic locations across major innovation hubs worldwide', '{"items": [{"id": 1, "logo": "SF", "name": "San Francisco", "stage": "Series B", "sector": "Quantum Computing", "description": "Leading quantum computing infrastructure for enterprise applications"}, {"id": 2, "logo": "SG", "name": "Singapore", "stage": "Series A", "sector": "MedTech", "description": "AI-powered diagnostic imaging and automated healthcare solutions"}, {"id": 3, "logo": "CHE", "name": "Chennai", "stage": "Growth", "sector": "Clean Energy", "description": "Next-generation battery storage and renewable energy systems"}, {"id": 4, "logo": "QA", "name": "Qatar", "stage": "Series C", "sector": "Robotics", "description": "Autonomous warehouse and supply chain automation solutions"}]}', '', NULL, NULL, 'full_width', 3, true, '2025-10-04 08:47:00.711232', '2025-10-04 12:17:40.912883');
INSERT INTO public.page_content VALUES (34, 'team', 'hero', 'hero', 'Our Team Members', '', 'Meet the experienced professionals behind Seven Boson Group''s investment success and strategic vision.', '{}', 'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=1920', '', '', NULL, 0, true, '2025-10-04 07:56:37.99572', '2025-10-04 12:07:58.391708');
INSERT INTO public.page_content VALUES (29, 'about', 'feature_list', 'investment_types', 'Investment Strategies', '', 'Our diversified approach across multiple asset classes and strategies', '{}', '', NULL, NULL, 'grid', 2, true, '2025-10-04 07:56:37.99572', '2025-10-04 12:17:46.607646');
INSERT INTO public.page_content VALUES (37, 'contact', 'form_config', 'contact_form', 'Contact Form Configuration', NULL, 'Form field options and validation rules', '{"subject_options": [{"label": "Select a subject", "value": ""}, {"label": "Investment Inquiry", "value": "investment-inquiry"}, {"label": "Funding Application", "value": "funding-application"}, {"label": "Partnership Opportunities", "value": "partnership"}, {"label": "Media Inquiry", "value": "media"}, {"label": "General Question", "value": "general"}]}', NULL, NULL, NULL, NULL, 1, true, '2025-10-04 08:47:00.717625', '2025-10-04 08:47:00.717625');
INSERT INTO public.page_content VALUES (38, 'apply', 'form_config', 'apply_form', 'Application Form Configuration', NULL, 'Form field options and validation rules', '{"country_options": [{"label": "Select your country", "value": ""}, {"label": "United States", "value": "US"}, {"label": "Canada", "value": "CA"}, {"label": "United Kingdom", "value": "UK"}, {"label": "Germany", "value": "DE"}, {"label": "France", "value": "FR"}, {"label": "Japan", "value": "JP"}, {"label": "Australia", "value": "AU"}, {"label": "Singapore", "value": "SG"}, {"label": "Other", "value": "other"}], "funding_amount_options": [{"label": "Select funding range", "value": ""}, {"label": "Under $1M", "value": "under-1m"}, {"label": "$1M - $5M", "value": "1m-5m"}, {"label": "$5M - $10M", "value": "5m-10m"}, {"label": "$10M - $25M", "value": "10m-25m"}, {"label": "$25M - $50M", "value": "25m-50m"}, {"label": "$50M - $100M", "value": "50m-100m"}, {"label": "Over $100M", "value": "over-100m"}], "investment_stage_options": [{"label": "Select investment stage", "value": ""}, {"label": "Pre-Seed", "value": "pre-seed"}, {"label": "Seed", "value": "seed"}, {"label": "Series A", "value": "series-a"}, {"label": "Series B", "value": "series-b"}, {"label": "Series C", "value": "series-c"}, {"label": "Growth", "value": "growth"}, {"label": "Pre-IPO", "value": "pre-ipo"}]}', NULL, NULL, NULL, NULL, 1, true, '2025-10-04 08:47:00.718112', '2025-10-04 08:47:00.718112');
INSERT INTO public.page_content VALUES (40, 'investment-classes', 'section', 'green_tech', 'Green Technology & Sustainability', NULL, 'Investing in the future of clean energy and sustainable technologies', '{"features": ["Renewable Energy Systems", "Battery Storage Technology", "Carbon Capture Solutions", "Smart Grid Infrastructure", "Electric Vehicle Ecosystem", "Sustainable Materials"], "performance": {"period": "5-year average", "returns": "31.7%", "portfolio_size": "$1.8B"}, "background_image": "/src/images/investment-classes/Innovation-inv.jpeg"}', NULL, NULL, NULL, NULL, 2, true, '2025-10-04 08:47:00.719144', '2025-10-04 08:47:00.719144');
INSERT INTO public.page_content VALUES (41, 'investment-classes', 'section', 'medtech', 'Medical Technology Innovation', NULL, 'Transforming healthcare through cutting-edge medical technology investments', '{"features": ["Digital Health Platforms", "Medical Device Innovation", "Telemedicine Solutions", "Genomics & Personalized Medicine", "Surgical Robotics", "Health Data Analytics"], "performance": {"period": "3-year average", "returns": "24.9%", "portfolio_size": "$1.4B"}, "background_image": "/src/images/investment-classes/ai_dynamic_scaling_data_center.png"}', NULL, NULL, NULL, NULL, 3, true, '2025-10-04 08:47:00.71954', '2025-10-04 08:47:00.71954');
INSERT INTO public.page_content VALUES (42, 'investment-classes', 'features', 'investment_classes', 'Investment Classes', '', 'Our diverse investment classes across different sectors', '{"items": [{"id": "ai-cloud-services", "icon": "Activity", "order": 1, "title": "Strategic AI Cloud Services and Data Centers", "subtitle": "Enabling Global AI Super Intelligence", "image_url": "/src/images/investment-classes/ai_dynamic_scaling_data_center.png", "icon_color": "text-red-500", "description": "Seven Boson Group Ltd invests in a network of AI-optimized cloud and data center service providers that are purpose built to support tomorrow''s AI super intelligence needs, offering fractionalized GPU resources, flexible SLAs, and advanced efficiency across computer, energy, carbon, and water. Its hybrid terrestrial and space locations deliver up to 85% cost savings over traditional models without sacrificing performance, security and reliability.", "image_position": "right", "background_color": "bg-slate-50"}, {"id": "green-tech", "icon": "Leaf", "order": 2, "title": "Green Tech Revolution", "subtitle": "Why Green Tech?", "image_url": "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-green-500", "description": "We recognize the pressing need to address environmental challenges. Our commitment to sustainability drives us to support startups dedicated to renewable energy, sustainable agriculture, clean transportation, and eco-friendly solutions.", "image_position": "left", "background_color": "bg-white", "secondary_subtitle": "Positive Impact", "secondary_description": "By investing in Green Tech, we aim to reduce carbon footprints, mitigate climate change, and contribute to a healthier planet for future generations."}, {"id": "medtech", "icon": "Activity", "order": 3, "title": "Revolutionizing Healthcare with MedTech", "subtitle": "Automated Value Based Healthcare", "image_url": "https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-red-500", "description": "Medical technology has the power to save lives and improve the quality of care. We are dedicated to supporting startups that are creating innovative medical devices, diagnostic tools, and healthcare solutions.", "image_position": "right", "background_color": "bg-slate-50", "secondary_subtitle": "Health and Well-being", "secondary_description": "Our investments in MedTech aim to make healthcare more accessible, efficient, and patient-centric, fostering a healthier global community."}, {"id": "ai-advancements", "icon": "Leaf", "order": 4, "title": "Artificial Intelligence Advancements", "subtitle": "AI''s Potential", "image_url": "/src/images/investment-classes/Artificial-Intelligence.jpeg", "icon_color": "text-green-500", "description": "Artificial Intelligence is reshaping industries and the way we live and work. We are on the lookout for startups that are pioneering breakthroughs in machine learning, natural language processing, computer vision, and more.", "image_position": "left", "background_color": "bg-white", "secondary_subtitle": "Societal Transformation", "secondary_description": "Our investments in AI are geared towards enhancing productivity, healthcare, education, and automation, ultimately leading to a smarter and more efficient world."}, {"id": "enabling-tech", "icon": "Activity", "order": 5, "title": "Empowering Innovation through Enabling Tech", "subtitle": "Foundation of Progress", "image_url": "/src/images/investment-classes/Innovation-inv.jpeg", "icon_color": "text-red-500", "description": "Enabling technologies form the backbone of innovation. We invest in startups that develop cutting-edge technologies, infrastructure, and platforms to enable the growth of other industries.", "image_position": "right", "background_color": "bg-slate-50", "secondary_subtitle": "Driving Progress", "secondary_description": "Our commitment to Enabling Tech is driven by the belief that strong foundations are essential for the rapid advancement of society and technology."}]}', '', NULL, NULL, 'full_width', 1, true, '2025-10-04 09:02:23.738987', '2025-10-04 12:10:24.832765');
INSERT INTO public.page_content VALUES (39, 'investment-classes', 'section', 'ai_investments', 'Artificial Intelligence Investments', '', 'Leading the AI revolution with strategic investments in next-generation platforms', '{"features": ["Machine Learning Infrastructure", "AI-as-a-Service Platforms", "Computer Vision Technologies", "Natural Language Processing", "Autonomous Systems", "Edge AI Computing"], "performance": {"period": "3-year average", "returns": "28.4%", "portfolio_size": "$2.1B"}, "background_image": "/src/images/investment-classes/Artificial-Intelligence.jpeg"}', '', NULL, NULL, 'full_width', 1, true, '2025-10-04 08:47:00.718543', '2025-10-04 09:17:50.013484');
INSERT INTO public.page_content VALUES (43, 'investment-classes', 'features', 'investment_classes', 'Investment Classes', '', 'Our diverse investment classes across different sectors', '{"items": [{"id": "ai-cloud-services", "icon": "Activity", "order": 1, "title": "Strategic AI Cloud Services and Data Centers", "subtitle": "Enabling Global AI Super Intelligence", "image_url": "https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-red-500", "description": "Seven Boson Group Ltd invests in a network of AI-optimized cloud and data center service providers that are purpose built to support tomorrow''s AI super intelligence needs, offering fractionalized GPU resources, flexible SLAs, and advanced efficiency across computer, energy, carbon, and water. Its hybrid terrestrial and space locations deliver up to 85% cost savings over traditional models without sacrificing performance, security and reliability.", "image_position": "right", "background_color": "bg-slate-50"}, {"id": "green-tech", "icon": "Leaf", "order": 2, "title": "Green Tech Revolution", "subtitle": "Why Green Tech?", "image_url": "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-green-500", "description": "We recognize the pressing need to address environmental challenges. Our commitment to sustainability drives us to support startups dedicated to renewable energy, sustainable agriculture, clean transportation, and eco-friendly solutions.", "image_position": "left", "background_color": "bg-white", "secondary_subtitle": "Positive Impact", "secondary_description": "By investing in Green Tech, we aim to reduce carbon footprints, mitigate climate change, and contribute to a healthier planet for future generations."}, {"id": "medtech", "icon": "Activity", "order": 3, "title": "Revolutionizing Healthcare with MedTech", "subtitle": "Automated Value Based Healthcare", "image_url": "https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-red-500", "description": "Medical technology has the power to save lives and improve the quality of care. We are dedicated to supporting startups that are creating innovative medical devices, diagnostic tools, and healthcare solutions.", "image_position": "right", "background_color": "bg-slate-50", "secondary_subtitle": "Health and Well-being", "secondary_description": "Our investments in MedTech aim to make healthcare more accessible, efficient, and patient-centric, fostering a healthier global community."}, {"id": "ai-advancements", "icon": "Leaf", "order": 4, "title": "Artificial Intelligence Advancements", "subtitle": "AI''s Potential", "image_url": "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-green-500", "description": "Artificial Intelligence is reshaping industries and the way we live and work. We are on the lookout for startups that are pioneering breakthroughs in machine learning, natural language processing, computer vision, and more.", "image_position": "left", "background_color": "bg-white", "secondary_subtitle": "Societal Transformation", "secondary_description": "Our investments in AI are geared towards enhancing productivity, healthcare, education, and automation, ultimately leading to a smarter and more efficient world."}, {"id": "enabling-tech", "icon": "Activity", "order": 5, "title": "Empowering Innovation through Enabling Tech", "subtitle": "Foundation of Progress", "image_url": "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-red-500", "description": "Enabling technologies form the backbone of innovation. We invest in startups that develop cutting-edge technologies, infrastructure, and platforms to enable the growth of other industries.", "image_position": "right", "background_color": "bg-slate-50", "secondary_subtitle": "Driving Progress", "secondary_description": "Our commitment to Enabling Tech is driven by the belief that strong foundations are essential for the rapid advancement of society and technology."}]}', '', NULL, NULL, 'full_width', 1, true, '2025-10-04 09:06:16.95766', '2025-10-04 09:18:05.671896');
INSERT INTO public.page_content VALUES (36, 'about', 'section', 'mission', 'Our Mission', '', 'Our Mission is to become the leading global private equity holding company delivering consistent high yield returns capturing the growth of tomorrow''s most innovative sectors – AI as a Service, Robotics, Quantum Compute, Next Gen Energy, MedTech', '{"quote": "Our Mission is to become the leading global private equity holding company delivering consistent high yield returns capturing the growth of tomorrow''s most innovative sectors – AI as a Service, Robotics, Quantum Compute, Next Gen Energy, MedTech", "author": "Seven Boson Group Leadership Team"}', '', NULL, NULL, 'full_width', 2, true, '2025-10-04 08:47:00.716847', '2025-10-04 12:10:41.320236');


--
-- Data for Name: portfolio_companies; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.portfolio_companies VALUES (7, 'Seven Boson Tech', 'Technology holding and development', '', 'Technology', NULL, 6, true, '2025-10-04 02:58:42.216336', '2025-10-04 02:58:42.216336');
INSERT INTO public.portfolio_companies VALUES (1, 'QuantAI Digital Updated', 'Leading quantum computing infrastructure for enterprise applications with enhanced AI capabilities', 'https://quantai-updated.example.com', 'Quantum Computing', 10, 0, true, '2025-10-04 02:58:42.214186', '2025-10-04 13:52:10.698712');
INSERT INTO public.portfolio_companies VALUES (14, 'Telaverge', 'Advanced telecommunications and 5G infrastructure', 'https://telaverge.example.com', 'AI Technology', 13, 0, true, '2025-10-04 09:38:51.388537', '2025-10-04 13:52:15.707011');
INSERT INTO public.portfolio_companies VALUES (15, 'ZeroCode', 'No-code platform for enterprise application development', 'https://zerocode.example.com', 'AI Technology', 15, 0, true, '2025-10-04 09:38:51.389099', '2025-10-04 13:52:19.831709');
INSERT INTO public.portfolio_companies VALUES (16, 'Procera Networks', 'Network intelligence and analytics solutions', 'https://procera.example.com', 'Cybersecurity', 9, 0, true, '2025-10-04 09:38:51.389708', '2025-10-04 13:52:25.58382');
INSERT INTO public.portfolio_companies VALUES (17, 'AquaTherm India', 'Sustainable water heating and thermal management systems', 'https://aquatherm.example.com', 'Green Technology', 14, 0, true, '2025-10-04 09:38:51.39037', '2025-10-04 13:52:29.744941');
INSERT INTO public.portfolio_companies VALUES (11, 'Redback Networks', 'Next-generation networking solutions for high-performance computing', 'https://redback.example.com', 'AI Technology', 8, 2, true, '2025-10-04 09:38:51.385837', '2025-10-04 13:52:36.203512');
INSERT INTO public.portfolio_companies VALUES (12, 'Biotricity', 'AI-powered diagnostic imaging and automated healthcare solutions', 'https://biotricity.example.com', 'MedTech', 12, 3, true, '2025-10-04 09:38:51.387317', '2025-10-04 13:52:45.263256');
INSERT INTO public.portfolio_companies VALUES (13, 'GoPebble', 'Sustainable transportation and mobility solutions', 'https://gopebble.example.com', 'Green Technology', 11, 4, true, '2025-10-04 09:38:51.387986', '2025-10-04 13:52:57.863671');


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

INSERT INTO public.team_members VALUES (2, 'Ramesh Santhanam', 'Managing Partner, 7Boson', 'Ramesh Santhanam brings more than 30 years of global technology leadership across next-generation energy, solar, wind, battery and electric vehicles, 5G/6G communications, enterprise software, defense technology, cryogenics, and biotechnology. He has served as Chief Innovation Officer at IIT Madras, Director at Cryogenics Ltd., Chairman of ACL Chemicals, and Vice President & Head of Business Development and Projects at Ashok Leyland Ltd.', 'He earned a B.S. in Physics and Aeronautical Engineering from MIT and a Masters in Manufacturing Engineering from Arizona State University, where he was a Regents Scholar and member of the U.S. Honor Society.', 'https://www.linkedin.com/in/ramesh-santhanam-33919a52/', 'ramesh@sevenbosongroup.com', 6, 0, true, '2025-10-04 02:58:42.208892', '2025-10-04 13:06:35.603583');
INSERT INTO public.team_members VALUES (3, 'Chris Jarrous', 'Managing Partner, 7Boson | MGP/PM Helios Alpha | CFA', 'Chris Jarrous has 25 years of experience in investment management and financial advisory, specializing in emerging growth technology companies. He spent 10 years as Managing Partner and Portfolio Manager at Dunlap Equity Partners, was a private investor with JF Investments, and served as Senior Vice President and Co-Portfolio Manager at MicroCapital.', 'Chris earned an MBA from the University of California, Los Angeles, and a B.S. in Finance from the University of California, Berkeley. He is a CFA charterholder and member of the San Francisco CFA Society.', 'https://www.linkedin.com/in/chris-jarrous/', 'Chris.jarrous@sevenbosongroup.com', 3, 0, true, '2025-10-04 02:58:42.209321', '2025-10-04 13:06:44.067816');
INSERT INTO public.team_members VALUES (6, 'John Cooleen', 'Partner, 7Boson | Partner, Helios Alpha Fund', 'John Cooleen has over 25 years of capital markets investing experience with a proven record of originating, structuring, and successfully funding complex transactions for venture and growth-stage companies. He held roles in Merrill Lynch Private Client Group and senior positions in investment banking, institutional equities, and capital markets at First Security Bank, Wells Fargo, and B. Riley.', 'John lives in the Philadelphia area with his wife and three children. He is a U.S. Marine Corps veteran and second-generation Marine, a competitive sculler, and holds FINRA Series 63, 65, 7, 79, and 24 licenses.', 'https://www.linkedin.com/in/john-cooleen/', '', 5, 0, true, '2025-10-04 02:58:42.210659', '2025-10-04 13:07:20.172844');
INSERT INTO public.team_members VALUES (4, 'Jay Amaran', 'Director of Education and Government services, 7Boson', 'Jay Amaran brings over 44 years of global experience, including 27 years with the World Bank, where his work created a footprint across more than 135 countries. His expertise covers global banking, real estate, and technology investments.', 'Jay is an alumnus of IIT Madras, IIM Ahmedabad, and MIT Cambridge.', 'https://www.linkedin.com/in/jay78iit80iim96mit/', '', 4, 0, true, '2025-10-04 02:58:42.209758', '2025-10-04 13:06:58.988227');
INSERT INTO public.team_members VALUES (5, 'Benoy Varghese', 'Managing Partner, 7Boson Qatar', 'Benoy Varghese is a commerce graduate with more than 32 years of extensive experience leading finance and investment functions across major groups in India and the Middle East. His expertise spans corporate finance, strategic investments, and high-level financial management for diversified enterprises.', '', '', '', 2, 0, true, '2025-10-04 02:58:42.210173', '2025-10-04 13:07:10.270719');
INSERT INTO public.team_members VALUES (7, 'Aniruddh Ramesh (Ph.D.)', 'Director of Technology, 7Boson', 'Dr. Aniruddh Ramesh (Ph.D.), a Singapore Permanent Resident, is a sustainability-driven technology leader specializing in advanced battery systems and clean energy integration. He holds a PhD in Mechanical Engineering from the National University of Singapore with a perfect academic record and is the inventor of two global patents in next-generation sodium-ion battery materials. His work spans both breakthrough research and commercialization.', 'Outside work, he is passionate about fitness, cricket, travel, photography, and giving back to the community.', 'https://www.linkedin.com/in/dr-aniruddh-ramesh-phd-19b045162/', 'aniruddh.ramesh@sevenbosongroup.com', 7, 0, true, '2025-10-04 02:58:42.211073', '2025-10-04 13:07:40.818658');
INSERT INTO public.team_members VALUES (1, 'Chet White', 'Managing General Partner, 7Boson | MGP/PM Helios Alpha | MP Carat Ventures', 'Chet White has over 35 years of investment management and financial advisory experience, focusing on emerging growth technology companies. He previously served as Managing Director of Technology Investment Banking at MCF & Co., Senior Vice President of Emerging Technology Equity Research at Wells Fargo and L.H. Friend, and Investment Executive at UBS and Morgan Stanley.', 'Chet holds an MBA from the University of Southern California and a B.S. in Finance from the University of Maryland and is a member of the San Francisco CFA Society.', 'https://www.linkedin.com/in/chet-white/', 'chet.white@sevenbosongroup.com', 1, 0, true, '2025-10-04 02:58:42.207097', '2025-10-04 13:44:26.474444');


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 3, true);


--
-- Name: blog_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.blog_categories_id_seq', 8, true);


--
-- Name: blog_post_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.blog_post_categories_id_seq', 12, true);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.blog_posts_id_seq', 5, true);


--
-- Name: branding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.branding_id_seq', 1, true);


--
-- Name: branding_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.branding_settings_id_seq', 10, true);


--
-- Name: content_blocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.content_blocks_id_seq', 1, false);


--
-- Name: footer_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.footer_links_id_seq', 6, true);


--
-- Name: form_configs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.form_configs_id_seq', 1, false);


--
-- Name: investment_areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.investment_areas_id_seq', 14, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.media_id_seq', 29, true);


--
-- Name: office_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.office_locations_id_seq', 6, true);


--
-- Name: page_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.page_content_id_seq', 43, true);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.pages_id_seq', 23, true);


--
-- Name: portfolio_companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.portfolio_companies_id_seq', 17, true);


--
-- Name: team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.team_members_id_seq', 8, true);


--
-- PostgreSQL database dump complete
--

\unrestrict HtXXG0Oc1L0COTz6ZiAG0EDGKYxqc5KzMVF289DFN1gBBxReCyzVgTUA7Us1gQ4

