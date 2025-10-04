import pool from '../config/database.js';

async function migrateHomepageContent() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🏠 Migrating homepage content to database...');

    // 1. Insert hero section content
    await client.query(`
      INSERT INTO hero_sections (
        page_slug, title, subtitle, description, background_image_url,
        primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link,
        position
      ) VALUES (
        'home',
        'Global Investing in Transformational Businesses, Technologies, and Strategic Assets',
        NULL,
        'Seven Boson Group Ltd — a premier global private equity holding company, fusing disciplined capital with in-house capabilities and operator-deep execution to deliver resilient, compounding returns — adding techno-commercial value at every level.',
        'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'Explore Our Portfolio',
        '/portfolio',
        'Apply for Value',
        '/apply',
        0
      )
    `);

    // 2. Insert page sections
    await client.query(`
      INSERT INTO page_sections (
        page_slug, section_type, title, description, position
      ) VALUES 
      (
        'home',
        'content',
        'Investment Focus Areas',
        'We specialize in three core investment pillars, each designed to maximize risk-adjusted returns through strategic diversification.',
        1
      ),
      (
        'home',
        'content',
        'Innovation Sectors',
        'We target the most disruptive and high-growth sectors driving the future economy.',
        2
      )
    `);

    // 3. Insert quote
    await client.query(`
      INSERT INTO quotes (
        quote_text, page_slug, section_position
      ) VALUES (
        'Unlocking asymmetric upside through innovation and strategic investment.',
        'home',
        1
      )
    `);

    // 4. Insert CTA section (currently commented out but let's add it for future use)
    await client.query(`
      INSERT INTO cta_sections (
        page_slug, title, description, primary_button_text, primary_button_link,
        background_color, text_color, is_active, position
      ) VALUES (
        'home',
        'Ready to Partner With Us?',
        'Join our portfolio of innovative companies and strategic partners.',
        'Contact Us Today',
        '/contact',
        '#1e293b',
        '#ffffff',
        false,
        3
      )
    `);

    await client.query('COMMIT');

    console.log('✅ Homepage content migration completed successfully!');
    console.log('📊 Content migrated:');
    console.log('   - 1 Hero section');
    console.log('   - 2 Page sections'); 
    console.log('   - 1 Quote');
    console.log('   - 1 CTA section (inactive)');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error migrating homepage content:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the migration
migrateHomepageContent()
  .then(() => {
    console.log('🎉 Homepage content migration script completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });