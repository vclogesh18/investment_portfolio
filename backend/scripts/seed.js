import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import createTables from './migrate.js';

const seedData = async () => {
  const client = await pool.connect();

  try {
    console.log('🌱 Seeding initial data...');

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO admin_users (email, password_hash, role) 
      VALUES ('admin@sevenboson.com', $1, 'admin')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);

    // Insert sample pages based on current website structure
    const pages = [
      {
        slug: 'home',
        title: 'Home',
        meta_description: 'Seven Boson Group Ltd delivers superior, high-yield returns through strategic private equity investments.',
        hero_title: 'Innovative Investment Solutions',
        hero_description: 'Seven Boson Group Ltd delivers superior, high-yield returns through strategic private equity investments across emerging technology sectors.',
        page_type: 'home'
      },
      {
        slug: 'about',
        title: 'About Seven Boson Group',
        meta_description: 'Learn about Seven Boson Group, a private equity holding company focused on disruptive innovation.',
        hero_title: 'About Seven Boson Group',
        hero_description: 'Seven Boson Group Ltd delivers superior, high-yield returns through strategic private equity investments across emerging technology sectors.',
        page_type: 'about'
      },
      {
        slug: 'investment-classes',
        title: 'Investment Classes',
        meta_description: 'Explore our diverse investment classes across AI, Green Technology, and Medical Technology sectors.',
        hero_title: 'Investment Classes',
        hero_description: 'Diversified portfolio across high-growth technology sectors',
        page_type: 'investment-classes'
      },
      {
        slug: 'portfolio',
        title: 'Portfolio',
        meta_description: 'View our portfolio of innovative companies across various technology sectors.',
        hero_title: 'Our Portfolio',
        hero_description: 'Innovative companies driving the future of technology',
        page_type: 'portfolio'
      },
      {
        slug: 'team',
        title: 'Team',
        meta_description: 'Meet the experienced team behind Seven Boson Group investment decisions.',
        hero_title: 'Our Team',
        hero_description: 'Experienced professionals driving investment excellence',
        page_type: 'team'
      }
    ];

    for (const page of pages) {
      await client.query(`
        INSERT INTO pages (slug, title, meta_description, hero_title, hero_description, page_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (slug) DO NOTHING
      `, [page.slug, page.title, page.meta_description, page.hero_title, page.hero_description, page.page_type]);
    }

    // Insert sample investment areas (pillars)
    const pillars = [
      {
        title: 'Private Equity',
        description: 'Strategic investments in high-growth companies with proven business models and strong leadership teams.',
        icon: 'Building2',
        category: 'pillar'
      },
      {
        title: 'Venture Capital',
        description: 'Early-stage investments in disruptive technologies and innovative startups with exceptional growth potential.',
        icon: 'Rocket',
        category: 'pillar'
      },
      {
        title: 'Growth Capital',
        description: 'Expansion funding for established companies looking to scale operations and enter new markets.',
        icon: 'TrendingUp',
        category: 'pillar'
      }
    ];

    for (const [index, pillar] of pillars.entries()) {
      await client.query(`
        INSERT INTO investment_areas (title, description, icon, category, position)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [pillar.title, pillar.description, pillar.icon, pillar.category, index]);
    }

    // Insert sample sectors
    const sectors = [
      {
        title: 'AI as a Service',
        description: 'Next-generation artificial intelligence platforms and machine learning solutions.',
        icon: 'Cpu',
        category: 'sector'
      },
      {
        title: 'Green Technology',
        description: 'Sustainable technology solutions for environmental challenges and clean energy.',
        icon: 'Leaf',
        category: 'sector'
      },
      {
        title: 'Medical Technology',
        description: 'Innovative healthcare technologies and medical device companies.',
        icon: 'Heart',
        category: 'sector'
      },
      {
        title: 'Quantum Computing',
        description: 'Revolutionary quantum computing platforms and quantum technology applications.',
        icon: 'Zap',
        category: 'sector'
      }
    ];

    for (const [index, sector] of sectors.entries()) {
      await client.query(`
        INSERT INTO investment_areas (title, description, icon, category, position)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [sector.title, sector.description, sector.icon, sector.category, index]);
    }

    // Insert sample office locations
    const offices = [
      {
        name: 'San Francisco',
        address: '350 California Street, San Francisco, CA 94104',
        phone: '+1 (415) 555-0123',
        email: 'sf@sevenboson.com',
        logo: 'SF',
        sector: 'AI & Technology Hub'
      },
      {
        name: 'Singapore',
        address: '1 Raffles Place, Singapore 048616',
        phone: '+65 6555 0123',
        email: 'sg@sevenboson.com',
        logo: 'SG',
        sector: 'Asia Pacific Operations'
      },
      {
        name: 'London',
        address: '1 King William Street, London EC4N 7AF, UK',
        phone: '+44 20 7555 0123',
        email: 'london@sevenboson.com',
        logo: 'LON',
        sector: 'European Markets'
      }
    ];

    for (const [index, office] of offices.entries()) {
      await client.query(`
        INSERT INTO office_locations (name, address, phone, email, logo, sector, position)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [office.name, office.address, office.phone, office.email, office.logo, office.sector, index]);
    }

    console.log('✅ Seed data inserted successfully!');
    console.log('📧 Admin login: admin@sevenboson.com');
    console.log('🔑 Password: admin123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createTables()
    .then(() => seedData())
    .then(() => {
      console.log('🎉 Database setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}

export default seedData;