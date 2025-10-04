import pool from '../config/database.js';

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Creating database tables...');

    // Create admin_users table first (no dependencies)
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create media table (used by other tables as foreign key)
    await client.query(`
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
    `);

    // Create pages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        meta_description TEXT,
        hero_title TEXT,
        hero_description TEXT,
        hero_background_image VARCHAR(255),
        status VARCHAR(20) DEFAULT 'published',
        page_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create content_blocks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_blocks (
        id SERIAL PRIMARY KEY,
        page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
        block_type VARCHAR(50) NOT NULL,
        title VARCHAR(255),
        content JSONB,
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create team_members table
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        experience TEXT,
        education TEXT,
        linkedin_url VARCHAR(255),
        email VARCHAR(255),
        image_id INTEGER REFERENCES media(id),
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create portfolio_companies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio_companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        website VARCHAR(255),
        sector VARCHAR(100),
        logo_id INTEGER REFERENCES media(id),
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create investment_areas table
    await client.query(`
      CREATE TABLE IF NOT EXISTS investment_areas (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        category VARCHAR(50),
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create office_locations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS office_locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        phone VARCHAR(50),
        email VARCHAR(255),
        logo VARCHAR(10),
        sector VARCHAR(100),
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create form_configs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS form_configs (
        id SERIAL PRIMARY KEY,
        form_name VARCHAR(100) NOT NULL,
        field_name VARCHAR(100) NOT NULL,
        field_type VARCHAR(50),
        options JSONB,
        is_required BOOLEAN DEFAULT false,
        position INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create indexes for performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_content_blocks_page_id ON content_blocks(page_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_portfolio_companies_active ON portfolio_companies(is_active);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);');

    console.log('✅ All tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createTables()
    .then(() => {
      console.log('🎉 Database migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export default createTables;