// src/app/api/test-db-debug/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Import dinamico per catturare errori
    const { query } = await import('@/lib/database/client');
    
    console.log('🔍 Tentativo connessione database...');
    
    // Test connessione semplice
    const result = await query('SELECT 1 as test');
    
    console.log('✅ Query eseguita con successo');
    
    return NextResponse.json({
      success: true,
      message: '✅ Database raggiungibile!',
      test_result: result.rows[0],
    });
    
  } catch (error: any) {
    console.error('❌ Errore:', error);
    
    return NextResponse.json({
      success: false,
      error_message: error.message,
      error_code: error.code,
      error_stack: error.stack?.split('\n').slice(0, 5),
      has_pg: typeof require !== 'undefined',
    }, { status: 500 });
  }
}

