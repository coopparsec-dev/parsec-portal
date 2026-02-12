// src/app/api/test-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Test variabili ambiente',
    has_database_url: !!process.env.DATABASE_URL,
    database_url_prefix: process.env.DATABASE_URL?.substring(0, 20) + '...',
    all_env_keys: Object.keys(process.env).filter(k => k.includes('DATABASE')),
  });
}
