import pool from '../config/database.js';

const seedAllPagesContent = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🌱 Seeding content for all pages...');

    // Clear existing content to avoid duplicates
    await client.query('DELETE FROM page_content');
    
    // Homepage Content
    console.log('📄 Adding Homepage content...');
    
    // Homepage Hero
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, subtitle, description, background_image_url, position) VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'home', 'hero', 'hero',
      'Global Investing in Transformational Businesses, Technologies, and Strategic Assets',
      null,
      'Seven Boson Group Ltd — a premier global private equity holding company, fusing disciplined capital with in-house capabilities and operator-deep execution to deliver resilient, compounding returns — adding techno-commercial value at every level.',
      'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920',
      0
    ]);

    // Homepage Investment Focus Section
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, layout_type, position) VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    `, [
      'home', 'text_section', 'investment_focus',
      'Investment Focus Areas',
      'We specialize in three core investment pillars, each designed to maximize risk-adjusted returns through strategic diversification.',
      'grid',
      1
    ]);

    // Homepage Innovation Sectors Section
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, layout_type, position) VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    `, [
      'home', 'text_section', 'innovation_sectors',
      'Innovation Sectors',
      'Targeting the most promising sectors driving global transformation.',
      'grid',
      2
    ]);

    // About Page Content
    console.log('📄 Adding About page content...');
    
    // About Hero
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, background_image_url, position) VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    `, [
      'about', 'hero', 'hero',
      'About Seven Boson Group',
      'Seven Boson Group Ltd delivers superior, high-yield, risk-adjusted returns by targeting the transformative growth of tomorrow\'s most disruptive sectors — including AI-as-a-Service, Robotics, Quantum Computing, Next-Gen Energy, MedTech, and Core Enabling Technologies.',
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920',
      0
    ]);

    // About Philosophy Section
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, subtitle, description, layout_type, position) VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'about', 'text_section', 'philosophy',
      'Disciplined. Diversified. Data-Driven',
      null,
      'We apply a disciplined GARP strategy across real estate, private equity, and alternatives—amplified by structured high-yield instruments and active management to unlock asymmetric, risk-adjusted returns.',
      'two_column',
      1
    ]);

    // About Investment Types Feature List
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, content, layout_type, position) VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'about', 'feature_list', 'investment_types',
      'Investment Strategies',
      'Our diversified approach across multiple asset classes and strategies',
      JSON.stringify([
        {
          title: "Disruptive Innovation Funds",
          description: "Investing in cutting-edge tech (AI, MedTech, Quantum) through hedge and venture funds.",
          icon: "Zap"
        },
        {
          title: "Distressed Private Equity (LBO)",
          description: "Control positions in undervalued companies with 2–5x leverage for turnaround and growth.",
          icon: "Users"
        },
        {
          title: "Strategic Assets",
          description: "High-yield, fully-levered strategic assets (8–10x) with strong cash flow and appreciation potential.",
          icon: "Globe"
        },
        {
          title: "High-Yield Structured Portfolio",
          description: "Targeting 8–15% yield or 35–50% ROI via preferred equity, convertible or high-yield debt.",
          icon: "TrendingUp"
        },
        {
          title: "Active Management Support",
          description: "Hands-on growth support to accelerate revenue and profits through corporate venture strategies.",
          icon: "Shield"
        },
        {
          title: "Distressed GARP (LBO)",
          description: "Opportunistic LBOs with strong fundamentals at deep discounts for high upside, low risk.",
          icon: "Target"
        }
      ]),
      'grid',
      2
    ]);

    // Contact Page Content
    console.log('📄 Adding Contact page content...');
    
    // Contact Hero
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, background_image_url, position) VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    `, [
      'contact', 'hero', 'hero',
      'Get in Touch With Us',
      'Ready to explore investment opportunities or discuss partnership possibilities? Our team is here to help you navigate your next strategic move.',
      'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1920',
      0
    ]);

    // Portfolio Page Content
    console.log('📄 Adding Portfolio page content...');
    
    // Portfolio Hero
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, background_image_url, position) VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    `, [
      'portfolio', 'hero', 'hero',
      'Portfolio Companies',
      'Explore our diverse portfolio of innovative companies across transformative sectors',
      'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1920',
      0
    ]);

    // Apply Page Content
    console.log('📄 Adding Apply page content...');
    
    // Apply Hero
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, background_image_url, position) VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    `, [
      'apply', 'hero', 'hero',
      'Apply for Funding',
      'Are you building a transformational company? We\'re looking for exceptional entrepreneurs with innovative solutions that have the potential to reshape industries.',
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920',
      0
    ]);

    // Investment Classes Page Content
    console.log('📄 Adding Investment Classes page content...');
    
    // Investment Classes Hero
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, background_image_url, position) VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    `, [
      'investment-classes', 'hero', 'hero',
      'Investment Classes',
      'Discover our diversified investment classes spanning strategic assets, private equity, and alternative investments across the most promising sectors.',
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920',
      0
    ]);

    // Team Page Content
    console.log('📄 Adding Team page content...');
    
    // Team Hero
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, background_image_url, position) VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    `, [
      'team', 'hero', 'hero',
      'Our Team',
      'Meet the experienced professionals behind Seven Boson Group\'s investment success and strategic vision.',
      'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=1920',
      0
    ]);

    await client.query('COMMIT');
    
    console.log('✅ All pages content seeded successfully!');
    console.log('📊 Summary:');
    console.log('  - Homepage: Hero + 2 sections');
    console.log('  - About: Hero + Philosophy + Investment Types');
    console.log('  - Contact: Hero section');
    console.log('  - Portfolio: Hero section');
    console.log('  - Apply: Hero section');
    console.log('  - Investment Classes: Hero section');
    console.log('  - Team: Hero section');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding pages content:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAllPagesContent()
    .then(() => {
      console.log('🎉 Page content seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to seed page content:', error);
      process.exit(1);
    });
}

export default seedAllPagesContent;