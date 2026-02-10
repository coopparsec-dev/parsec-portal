// Proxy API per Nextcloud
// Gestisce tutte le chiamate da /api/nc/* verso Nextcloud
// Aggiunge autenticazione server-side per evitare problemi CORS

import { NextRequest, NextResponse } from 'next/server';

// Legge le credenziali dalle variabili d'ambiente
const NC_URL = process.env.NEXTCLOUD_URL || 'http://parsec-nextcloud';
const NC_USER = process.env.NEXTCLOUD_ADMIN_USER || 'admin';
const NC_PASS = process.env.NEXTCLOUD_ADMIN_PASSWORD || '';

/**
 * Crea l'header di autenticazione Basic Auth
 */
function getAuthHeader(): string {
  const credentials = `${NC_USER}:${NC_PASS}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
}

/**
 * Handler GET - Per leggere dati da Nextcloud
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // In Next.js 16, params è una Promise che va awaited
  const params = await context.params;
  
  // Ricostruisce il percorso da /api/nc/ocs/v1/... → http://nextcloud/ocs/v1/...
  const ncPath = params.path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${NC_URL}/${ncPath}${searchParams ? '?' + searchParams : ''}`;

  console.log('🔍 Proxy GET:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'OCS-APIRequest': 'true', // Header obbligatorio per API Nextcloud
        'Accept': 'application/json',
      },
    });

    // Legge la risposta
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Errore proxy GET:', error);
    return NextResponse.json(
      { error: 'Errore connessione Nextcloud' },
      { status: 502 }
    );
  }
}

/**
 * Handler POST - Per ricerca, upload, ecc.
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // In Next.js 16, params è una Promise che va awaited
  const params = await context.params;
  
  const ncPath = params.path.join('/');
  const url = `${NC_URL}/${ncPath}`;

  console.log('📤 Proxy POST:', url);

  try {
    // Legge il body della richiesta
    const body = await request.text();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'OCS-APIRequest': 'true',
        'Accept': 'application/json',
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
      },
      body: body,
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Errore proxy POST:', error);
    return NextResponse.json(
      { error: 'Errore connessione Nextcloud' },
      { status: 502 }
    );
  }
}
