import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'investment_portfolio',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function seedPortfolioCompanies() {
  try {
    console.log('🚀 Starting Portfolio Companies seeding...');

    // Sample portfolio companies data
    const companies = [
      {
        name: 'QuantAI Digital',
        description: 'Leading quantum computing infrastructure for enterprise applications',
        website: 'https://quantai.example.com',
        sector: 'Quantum Computing',
        position: 1
      },
      {
        name: 'Redback Networks',
        description: 'Next-generation networking solutions for high-performance computing',
        website: 'https://redback.example.com',
        sector: 'AI Technology',
        position: 2
      },
      {
        name: 'Biotricity',
        description: 'AI-powered diagnostic imaging and automated healthcare solutions',
        website: 'https://biotricity.example.com',
        sector: 'MedTech',
        position: 3
      },
      {
        name: 'GoPebble',
        description: 'Sustainable transportation and mobility solutions',
        website: 'https://gopebble.example.com',
        sector: 'Green Technology',
        position: 4
      },
      {
        name: 'Telaverge',
        description: 'Advanced telecommunications and 5G infrastructure',
        website: 'https://telaverge.example.com',
        sector: 'AI Technology',
        position: 5
      },
      {
        name: 'ZeroCode',
        description: 'No-code platform for enterprise application development',
        website: 'https://zerocode.example.com',
        sector: 'AI Technology',
        position: 6
      },
      {
        name: 'Procera Networks',
        description: 'Network intelligence and analytics solutions',
        website: 'https://procera.example.com',
        sector: 'Cybersecurity',
        position: 7
      },
      {
        name: 'AquaTherm India',
        description: 'Sustainable water heating and thermal management systems',
        website: 'https://aquatherm.example.com',
        sector: 'Green Technology',
        position: 8
      }
    ];

    // Insert companies
    for (const company of companies) {
      const insertQuery = `
        INSERT INTO portfolio_companies (name, description, website, sector, position, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;

      await pool.query(insertQuery, [
        company.name,
        company.description,
        company.website,
        company.sector,
        company.position,
        true
      ]);

      console.log(`✅ Added: ${company.name}`);
    }

    console.log('🎉 Portfolio companies seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding portfolio companies:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seeding
seedPortfolioCompanies()
  .then(() => {
    console.log('📊 Portfolio seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });

export { seedPortfolioCompanies };