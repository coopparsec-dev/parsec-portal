// src/lib/database/client.ts
// Client per database PostgreSQL (Neon)

import { Pool } from 'pg';

// Usa DATABASE_URL da Neon Console
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon richiede SSL
  },
});

// Test connessione al primo utilizzo
pool.on('connect', () => {
  console.log('✅ Database connesso');
});

pool.on('error', (err) => {
  console.error('❌ Errore database pool:', err);
});

/**
 * Esegue una query SQL
 */
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    console.log('📊 Query eseguita:', {
      query: text.substring(0, 50) + '...',
      duration: `${duration}ms`,
      rows: res.rowCount
    });
    
    return res;
  } catch (error) {
    console.error('❌ Errore query database:', error);
    console.error('Query fallita:', text);
    throw error;
  }
}

export default pool;