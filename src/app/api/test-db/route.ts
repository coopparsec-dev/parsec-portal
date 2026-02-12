// src/app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/database/client';

export async function GET() {
  try {
    // Test query semplice
    const result = await query('SELECT NOW() as current_time');
    
    // Query tabelle
    const progetti = await query('SELECT * FROM progetti LIMIT 5');
    
    return NextResponse.json({
      success: true,
      message: '✅ Database connesso!',
      current_time: result.rows[0].current_time,
      progetti_count: progetti.rowCount,
      progetti: progetti.rows,
    });
  } catch (error: any) {
    console.error('❌ Database test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        details: error.stack 
      },
      { status: 500 }
    );
  }
}
