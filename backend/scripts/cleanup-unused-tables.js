import pool from '../config/database.js';

const removeUnusedTables = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🧹 Removing unused database tables...');

    // Tables to remove (replaced by unified page_content system)
    const tablesToRemove = [
      'content_blocks',    // Old content blocks approach
      'hero_sections',     // Old homepage hero sections  
      'page_sections',     // Old homepage page sections
      'quotes',           // Old homepage quotes
      'cta_sections',     // Old homepage CTA sections
      'form_configs'      // Not currently implemented
    ];

    console.log(`📋 Tables to be removed: ${tablesToRemove.join(', ')}`);

    // Check if tables exist and their row counts before removal
    for (const table of tablesToRemove) {
      try {
        const existsResult = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `, [table]);

        if (existsResult.rows[0].exists) {
          // Get row count
          const countResult = await client.query(`SELECT COUNT(*) FROM ${table}`);
          const rowCount = countResult.rows[0].count;
          console.log(`📊 Table '${table}' exists with ${rowCount} rows`);
        } else {
          console.log(`ℹ️  Table '${table}' does not exist`);
        }
      } catch (error) {
        console.log(`⚠️  Could not check table '${table}': ${error.message}`);
      }
    }

    // Ask for confirmation (in real usage, you might want manual confirmation)
    console.log('\n⚠️  WARNING: This will permanently delete the above tables and all their data!');
    console.log('🔄 Proceeding with removal...\n');

    await client.query('BEGIN');

    // Remove tables in order (considering dependencies)
    for (const table of tablesToRemove) {
      try {
        await client.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
        console.log(`✅ Removed table: ${table}`);
      } catch (error) {
        console.error(`❌ Error removing table '${table}':`, error.message);
      }
    }

    // Also remove any indexes that might be related to these tables
    const indexesToRemove = [
      'idx_content_blocks_page_id',
      'idx_hero_sections_page_slug',
      'idx_page_sections_page_slug',
      'idx_quotes_page_slug',
      'idx_cta_sections_page_slug'
    ];

    console.log('\n🔧 Removing related indexes...');
    for (const index of indexesToRemove) {
      try {
        await client.query(`DROP INDEX IF EXISTS ${index};`);
        console.log(`✅ Removed index: ${index}`);
      } catch (error) {
        console.log(`ℹ️  Index '${index}' did not exist or could not be removed`);
      }
    }

    await client.query('COMMIT');

    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('\n📊 Remaining tables in use:');
    
    // List remaining tables
    const remainingTablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    remainingTablesResult.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });

    console.log('\n💡 Benefits:');
    console.log('  • Cleaner database schema');
    console.log('  • No conflicting table structures'); 
    console.log('  • Unified content management through page_content table');
    console.log('  • Reduced database complexity');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run cleanup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  removeUnusedTables()
    .then(() => {
      console.log('\n🚀 Database cleanup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database cleanup failed:', error);
      process.exit(1);
    });
}

export default removeUnusedTables;