import pool from '../config/database.js';

async function cleanupDuplicates() {
  const client = await pool.connect();
  try {
    console.log('🧹 Cleaning up duplicate portfolio companies...');
    
    // Delete older/incomplete duplicates, keep the better ones
    const deletions = [
      { id: 5, name: 'QuantAI Digital (older)' },   // Keep IDs 1 and 10
      { id: 2, name: 'Biotricity (incomplete)' },   // Keep ID 12
      { id: 3, name: 'GoPebble (incomplete)' },     // Keep ID 13  
      { id: 6, name: 'Redback Networks (incomplete)' }, // Keep ID 11
      { id: 8, name: 'Telaverge (incomplete)' },    // Keep ID 14
      { id: 9, name: 'ZeroCode (incomplete)' },     // Keep ID 15
      { id: 4, name: 'Procera (incomplete)' }       // Keep ID 16
    ];
    
    for (const item of deletions) {
      await client.query('DELETE FROM portfolio_companies WHERE id = $1', [item.id]);
      console.log('❌ Removed:', item.name);
    }
    
    console.log('✅ Cleanup completed!');
    
    // Show remaining companies
    const result = await client.query('SELECT id, name, sector FROM portfolio_companies ORDER BY id');
    console.log('\n📋 Remaining portfolio companies:');
    result.rows.forEach(row => {
      console.log(`${row.id}: ${row.name} (${row.sector})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}

cleanupDuplicates();