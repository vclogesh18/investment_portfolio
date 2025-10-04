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

async function migrateInvestmentClassesContent() {
  try {
    console.log('🚀 Starting Investment Classes content migration...');

    // Investment Classes content data
    const investmentClassesData = {
      page_slug: 'investment-classes',
      content_type: 'features',
      section_name: 'investment_classes',
      title: 'Investment Classes',
      description: 'Our diverse investment classes across different sectors',
      position: 1,
      is_active: true,
      content: {
        items: [
          {
            id: 'ai-cloud-services',
            title: 'Strategic AI Cloud Services and Data Centers',
            subtitle: 'Enabling Global AI Super Intelligence',
            description: 'Seven Boson Group Ltd invests in a network of AI-optimized cloud and data center service providers that are purpose built to support tomorrow\'s AI super intelligence needs, offering fractionalized GPU resources, flexible SLAs, and advanced efficiency across computer, energy, carbon, and water. Its hybrid terrestrial and space locations deliver up to 85% cost savings over traditional models without sacrificing performance, security and reliability.',
            icon: 'Activity',
            icon_color: 'text-red-500',
            background_color: 'bg-slate-50',
            image_url: 'https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=800',
            image_position: 'right',
            order: 1
          },
          {
            id: 'green-tech',
            title: 'Green Tech Revolution',
            subtitle: 'Why Green Tech?',
            description: 'We recognize the pressing need to address environmental challenges. Our commitment to sustainability drives us to support startups dedicated to renewable energy, sustainable agriculture, clean transportation, and eco-friendly solutions.',
            secondary_subtitle: 'Positive Impact',
            secondary_description: 'By investing in Green Tech, we aim to reduce carbon footprints, mitigate climate change, and contribute to a healthier planet for future generations.',
            icon: 'Leaf',
            icon_color: 'text-green-500',
            background_color: 'bg-white',
            image_url: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=800',
            image_position: 'left',
            order: 2
          },
          {
            id: 'medtech',
            title: 'Revolutionizing Healthcare with MedTech',
            subtitle: 'Automated Value Based Healthcare',
            description: 'Medical technology has the power to save lives and improve the quality of care. We are dedicated to supporting startups that are creating innovative medical devices, diagnostic tools, and healthcare solutions.',
            secondary_subtitle: 'Health and Well-being',
            secondary_description: 'Our investments in MedTech aim to make healthcare more accessible, efficient, and patient-centric, fostering a healthier global community.',
            icon: 'Activity',
            icon_color: 'text-red-500',
            background_color: 'bg-slate-50',
            image_url: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800',
            image_position: 'right',
            order: 3
          },
          {
            id: 'ai-advancements',
            title: 'Artificial Intelligence Advancements',
            subtitle: 'AI\'s Potential',
            description: 'Artificial Intelligence is reshaping industries and the way we live and work. We are on the lookout for startups that are pioneering breakthroughs in machine learning, natural language processing, computer vision, and more.',
            secondary_subtitle: 'Societal Transformation',
            secondary_description: 'Our investments in AI are geared towards enhancing productivity, healthcare, education, and automation, ultimately leading to a smarter and more efficient world.',
            icon: 'Leaf',
            icon_color: 'text-green-500',
            background_color: 'bg-white',
            image_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
            image_position: 'left',
            order: 4
          },
          {
            id: 'enabling-tech',
            title: 'Empowering Innovation through Enabling Tech',
            subtitle: 'Foundation of Progress',
            description: 'Enabling technologies form the backbone of innovation. We invest in startups that develop cutting-edge technologies, infrastructure, and platforms to enable the growth of other industries.',
            secondary_subtitle: 'Driving Progress',
            secondary_description: 'Our commitment to Enabling Tech is driven by the belief that strong foundations are essential for the rapid advancement of society and technology.',
            icon: 'Activity',
            icon_color: 'text-red-500',
            background_color: 'bg-slate-50',
            image_url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
            image_position: 'right',
            order: 5
          }
        ]
      }
    };

    // Insert investment classes content
    const insertQuery = `
      INSERT INTO page_content (page_slug, content_type, section_name, title, description, position, is_active, content)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    await pool.query(insertQuery, [
      investmentClassesData.page_slug,
      investmentClassesData.content_type,
      investmentClassesData.section_name,
      investmentClassesData.title,
      investmentClassesData.description,
      investmentClassesData.position,
      investmentClassesData.is_active,
      JSON.stringify(investmentClassesData.content)
    ]);

    console.log('✅ Successfully migrated Investment Classes content to database!');
    console.log('📊 Content added:');
    console.log('- AI Cloud Services and Data Centers');
    console.log('- Green Tech Revolution');
    console.log('- MedTech Healthcare Solutions');
    console.log('- AI Advancements');
    console.log('- Enabling Technology Innovation');

  } catch (error) {
    console.error('❌ Error migrating Investment Classes content:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration
migrateInvestmentClassesContent()
  .then(() => {
    console.log('🎉 Investment Classes migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });

export { migrateInvestmentClassesContent };