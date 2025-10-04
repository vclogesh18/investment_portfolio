import pool from '../config/database.js';

const moveStaticContentToDB = async () => {
  const client = await pool.connect();
  
  try {
    console.log('� Moving static content to database...');

    // 1. Global Offices for About Page (replacing the companies array)
    const aboutOffices = [
      {
        name: 'San Francisco',
        logo: 'SF',
        sector: 'Quantum Computing',
        description: 'Leading quantum computing infrastructure for enterprise applications',
        stage: 'Series B'
      },
      {
        name: 'Singapore',
        logo: 'SG',
        sector: 'MedTech',
        description: 'AI-powered diagnostic imaging and automated healthcare solutions',
        stage: 'Series A'
      },
      {
        name: 'Chennai',
        logo: 'CHE',
        sector: 'Clean Energy',
        description: 'Next-generation battery storage and renewable energy systems',
        stage: 'Growth'
      },
      {
        name: 'Qatar',
        logo: 'QA',
        sector: 'Robotics',
        description: 'Autonomous warehouse and supply chain automation solutions',
        stage: 'Series C'
      }
    ];

    // Insert offices as features for about page
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, content, position)
      VALUES ('about', 'features', 'global_offices', 'Global Presence', 'Strategic locations across major innovation hubs worldwide', $1, 3)
    `, [JSON.stringify({
      items: aboutOffices.map((office, index) => ({
        id: index + 1,
        name: office.name,
        logo: office.logo,
        sector: office.sector,
        description: office.description,
        stage: office.stage
      }))
    })]);

    // 2. Mission Statement for About Page
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, content, position)
      VALUES ('about', 'section', 'mission', 'Our Mission', 'Our Mission is to become the leading global private equity holding company delivering consistent high yield returns capturing the growth of tomorrow''s most innovative sectors – AI as a Service, Robotics, Quantum Compute, Next Gen Energy, MedTech', $1, 2)
    `, [JSON.stringify({
      quote: "Our Mission is to become the leading global private equity holding company delivering consistent high yield returns capturing the growth of tomorrow's most innovative sectors – AI as a Service, Robotics, Quantum Compute, Next Gen Energy, MedTech",
      author: "Seven Boson Group Leadership Team"
    })]);

    // 3. Contact Form Options
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, content, position)
      VALUES ('contact', 'form_config', 'contact_form', 'Contact Form Configuration', 'Form field options and validation rules', $1, 1)
    `, [JSON.stringify({
      subject_options: [
        { value: '', label: 'Select a subject' },
        { value: 'investment-inquiry', label: 'Investment Inquiry' },
        { value: 'funding-application', label: 'Funding Application' },
        { value: 'partnership', label: 'Partnership Opportunities' },
        { value: 'media', label: 'Media Inquiry' },
        { value: 'general', label: 'General Question' }
      ]
    })]);

    // 4. Apply Form Options
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, content, position)
      VALUES ('apply', 'form_config', 'apply_form', 'Application Form Configuration', 'Form field options and validation rules', $1, 1)
    `, [JSON.stringify({
      country_options: [
        { value: '', label: 'Select your country' },
        { value: 'US', label: 'United States' },
        { value: 'CA', label: 'Canada' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'DE', label: 'Germany' },
        { value: 'FR', label: 'France' },
        { value: 'JP', label: 'Japan' },
        { value: 'AU', label: 'Australia' },
        { value: 'SG', label: 'Singapore' },
        { value: 'other', label: 'Other' }
      ],
      investment_stage_options: [
        { value: '', label: 'Select investment stage' },
        { value: 'pre-seed', label: 'Pre-Seed' },
        { value: 'seed', label: 'Seed' },
        { value: 'series-a', label: 'Series A' },
        { value: 'series-b', label: 'Series B' },
        { value: 'series-c', label: 'Series C' },
        { value: 'growth', label: 'Growth' },
        { value: 'pre-ipo', label: 'Pre-IPO' }
      ],
      funding_amount_options: [
        { value: '', label: 'Select funding range' },
        { value: 'under-1m', label: 'Under $1M' },
        { value: '1m-5m', label: '$1M - $5M' },
        { value: '5m-10m', label: '$5M - $10M' },
        { value: '10m-25m', label: '$10M - $25M' },
        { value: '25m-50m', label: '$25M - $50M' },
        { value: '50m-100m', label: '$50M - $100M' },
        { value: 'over-100m', label: 'Over $100M' }
      ]
    })]);

    // 5. Investment Classes Content - AI
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, content, position)
      VALUES ('investment-classes', 'section', 'ai_investments', 'Artificial Intelligence Investments', 'Leading the AI revolution with strategic investments in next-generation platforms', $1, 1)
    `, [JSON.stringify({
      background_image: '/src/images/investment-classes/Artificial-Intelligence.jpeg',
      features: [
        'Machine Learning Infrastructure',
        'AI-as-a-Service Platforms',
        'Computer Vision Technologies',
        'Natural Language Processing',
        'Autonomous Systems',
        'Edge AI Computing'
      ],
      performance: {
        returns: '28.4%',
        period: '3-year average',
        portfolio_size: '$2.1B'
      }
    })]);

    // Green Technology
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, content, position)
      VALUES ('investment-classes', 'section', 'green_tech', 'Green Technology & Sustainability', 'Investing in the future of clean energy and sustainable technologies', $1, 2)
    `, [JSON.stringify({
      background_image: '/src/images/investment-classes/Innovation-inv.jpeg',
      features: [
        'Renewable Energy Systems',
        'Battery Storage Technology',
        'Carbon Capture Solutions',
        'Smart Grid Infrastructure',
        'Electric Vehicle Ecosystem',
        'Sustainable Materials'
      ],
      performance: {
        returns: '31.7%',
        period: '5-year average',
        portfolio_size: '$1.8B'
      }
    })]);

    // MedTech
    await client.query(`
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, content, position)
      VALUES ('investment-classes', 'section', 'medtech', 'Medical Technology Innovation', 'Transforming healthcare through cutting-edge medical technology investments', $1, 3)
    `, [JSON.stringify({
      background_image: '/src/images/investment-classes/ai_dynamic_scaling_data_center.png',
      features: [
        'Digital Health Platforms',
        'Medical Device Innovation',
        'Telemedicine Solutions',
        'Genomics & Personalized Medicine',
        'Surgical Robotics',
        'Health Data Analytics'
      ],
      performance: {
        returns: '24.9%',
        period: '3-year average',
        portfolio_size: '$1.4B'
      }
    })]);

    console.log('✅ Successfully moved all static content to database!');
    console.log('📊 Content added:');
    console.log('   - Global offices for About page');
    console.log('   - Mission statement');
    console.log('   - Contact form configuration');
    console.log('   - Apply form configuration');
    console.log('   - Investment classes content');

  } catch (error) {
    console.error('❌ Error moving static content:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default moveStaticContentToDB;

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  moveStaticContentToDB()
    .then(() => {
      console.log('🎉 Static content migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}