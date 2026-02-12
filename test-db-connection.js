
// test-db-connection.js
// Test connessione database MySQL remoto

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Test connessione database MySQL...\n');
  
  const config = {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  };
  
  console.log('📋 Configurazione:');
  console.log('Host:', config.host);
  console.log('Porta:', config.port);
  console.log('Database:', config.database);
  console.log('User:', config.user);
  console.log('Password:', config.password ? '***' + config.password.slice(-3) : 'NON IMPOSTATA');
  console.log('');
  
  try {
    console.log('⏳ Tentativo connessione...');
    const connection = await mysql.createConnection(config);
    
    console.log('✅ Connessione riuscita!\n');
    
    // Test query
    console.log('📊 Tabelle esistenti:');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('   (nessuna tabella trovata - database vuoto)');
    } else {
      tables.forEach((table, i) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${i + 1}. ${tableName}`);
      });
    }
    
    await connection.end();
    console.log('\n✅ Test completato con successo!');
    
  } catch (error) {
    console.error('❌ Errore connessione:\n');
    console.error('Tipo errore:', error.code);
    console.error('Messaggio:', error.message);
    console.error('');
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 Suggerimento: Hostname non trovato. Verifica DATABASE_HOST in .env.local');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Suggerimento: Credenziali errate. Verifica username/password in .env.local');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.log('💡 Suggerimento: Server non raggiungibile. Potrebbe servire tunnel SSH o accesso remoto non abilitato.');
    }
    
    process.exit(1);
  }
}

testConnection();
