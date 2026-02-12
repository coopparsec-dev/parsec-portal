// src/app/api/test-ping/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: '✅ API route funziona!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
