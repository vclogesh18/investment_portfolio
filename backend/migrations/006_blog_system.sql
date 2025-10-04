-- Blog System Migration
-- Seven Boson Group CMS - Blog Feature Implementation

-- Create blog_categories table
CREATE TABLE blog_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#1976d2', -- Hex color for category badge
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT, -- Short description for listing pages
  cover_image VARCHAR(255), -- URL or path to cover image
  meta_description TEXT, -- SEO meta description
  meta_keywords TEXT, -- SEO keywords
  author VARCHAR(255) NOT NULL,
  author_email VARCHAR(255),
  reading_time_minutes INTEGER DEFAULT 5, -- Estimated reading time
  view_count INTEGER DEFAULT 0, -- Track post views
  featured BOOLEAN DEFAULT false, -- Featured posts for homepage
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create many-to-many relationship table for blog posts and categories
CREATE TABLE blog_post_categories (
  id SERIAL PRIMARY KEY,
  blog_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(blog_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_post_categories_blog_id ON blog_post_categories(blog_id);
CREATE INDEX idx_blog_post_categories_category_id ON blog_post_categories(category_id);

-- Create trigger to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
  ('Technology', 'technology', 'Latest technology trends and innovations', '#2196F3'),
  ('Investment Insights', 'investment-insights', 'Market analysis and investment strategies', '#4CAF50'),
  ('Company Updates', 'company-updates', 'News and updates from Seven Boson Group', '#FF9800'),
  ('Industry Analysis', 'industry-analysis', 'Deep dive into various industries we invest in', '#9C27B0'),
  ('AI & Machine Learning', 'ai-machine-learning', 'Artificial Intelligence and ML developments', '#F44336'),
  ('Green Technology', 'green-technology', 'Sustainable and clean technology investments', '#8BC34A'),
  ('Healthcare Innovation', 'healthcare-innovation', 'Medical technology and healthcare advancements', '#00BCD4');

-- Insert sample blog posts for testing
INSERT INTO blog_posts (
  title, 
  slug, 
  content, 
  excerpt, 
  author, 
  author_email, 
  reading_time_minutes, 
  featured, 
  published, 
  published_at,
  meta_description,
  meta_keywords
) VALUES
  (
    'The Future of AI in Private Equity Investment Decisions',
    'future-ai-private-equity-investment-decisions',
    '<h2>Artificial Intelligence is Revolutionizing Investment Analysis</h2>
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
    <p>As we continue to refine our AI-driven investment strategies, we''re seeing new opportunities emerge in sectors previously considered too complex or volatile for traditional analysis methods.</p>',
    'Explore how artificial intelligence is transforming private equity investment decisions and driving superior portfolio performance at Seven Boson Group.',
    'Seven Boson Investment Team',
    'investments@sevenbosongroup.com',
    8,
    true,
    true,
    NOW() - INTERVAL '2 days',
    'Discover how AI is revolutionizing private equity investments. Learn about AI-driven due diligence, market prediction, and portfolio optimization strategies.',
    'AI private equity, artificial intelligence investing, machine learning finance, investment technology, portfolio optimization'
  ),
  (
    'Sustainable Technology: The Next Trillion-Dollar Investment Opportunity',
    'sustainable-technology-trillion-dollar-investment-opportunity',
    '<h2>Green Technology is Creating Unprecedented Investment Returns</h2>
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
    
    <p>We''re particularly excited about our recent investments in breakthrough battery technology and next-generation solar panel efficiency improvements.</p>',
    'Discover why sustainable technology represents the next trillion-dollar investment opportunity and how Seven Boson Group is leading the charge.',
    'Green Technology Team',
    'greentech@sevenbosongroup.com',
    6,
    true,
    true,
    NOW() - INTERVAL '5 days',
    'Explore sustainable technology investment opportunities. Learn about green tech market projections and Seven Boson Group''s successful portfolio.',
    'sustainable technology investment, green tech portfolio, renewable energy investing, clean technology fund'
  ),
  (
    'Digital Health Revolution: Investing in the Future of Healthcare',
    'digital-health-revolution-investing-future-healthcare',
    '<h2>Healthcare Technology is Transforming Patient Outcomes</h2>
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
    
    <p>Seven Boson Group has invested $300M in digital health companies, with an average portfolio company valuation increase of 340% over 18 months.</p>',
    'Explore the digital health revolution and discover how healthcare technology investments are transforming patient care and generating superior returns.',
    'Healthcare Investment Team',
    'healthcare@sevenbosongroup.com',
    7,
    false,
    true,
    NOW() - INTERVAL '1 week',
    'Learn about digital health investment opportunities in telemedicine, AI diagnostics, wearable monitoring, and drug discovery technology.',
    'digital health investing, healthcare technology, telemedicine investment, AI diagnostics, wearable health tech'
  );

-- Link blog posts to categories
INSERT INTO blog_post_categories (blog_id, category_id) VALUES
  -- AI article: Technology + AI & Machine Learning + Investment Insights
  (1, 1), (1, 5), (1, 2),
  -- Sustainable tech: Technology + Green Technology + Investment Insights
  (2, 1), (2, 6), (2, 2),
  -- Healthcare: Technology + Healthcare Innovation + Investment Insights
  (3, 1), (3, 7), (3, 2);

-- Create view for easy blog post queries with categories
CREATE VIEW blog_posts_with_categories AS
SELECT 
  bp.id,
  bp.title,
  bp.slug,
  bp.content,
  bp.excerpt,
  bp.cover_image,
  bp.meta_description,
  bp.meta_keywords,
  bp.author,
  bp.author_email,
  bp.reading_time_minutes,
  bp.view_count,
  bp.featured,
  bp.published,
  bp.published_at,
  bp.created_at,
  bp.updated_at,
  COALESCE(
    ARRAY_AGG(
      JSON_BUILD_OBJECT(
        'id', bc.id,
        'name', bc.name,
        'slug', bc.slug,
        'color', bc.color
      ) ORDER BY bc.name
    ) FILTER (WHERE bc.id IS NOT NULL),
    ARRAY[]::json[]
  ) as categories
FROM blog_posts bp
LEFT JOIN blog_post_categories bpc ON bp.id = bpc.blog_id
LEFT JOIN blog_categories bc ON bpc.category_id = bc.id AND bc.is_active = true
GROUP BY bp.id, bp.title, bp.slug, bp.content, bp.excerpt, bp.cover_image, 
         bp.meta_description, bp.meta_keywords, bp.author, bp.author_email, 
         bp.reading_time_minutes, bp.view_count, bp.featured, bp.published, 
         bp.published_at, bp.created_at, bp.updated_at;

COMMENT ON TABLE blog_posts IS 'Blog posts for Seven Boson Group website';
COMMENT ON TABLE blog_categories IS 'Categories for organizing blog posts';
COMMENT ON TABLE blog_post_categories IS 'Many-to-many relationship between posts and categories';
COMMENT ON VIEW blog_posts_with_categories IS 'Blog posts with associated categories for easy querying';