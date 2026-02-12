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
  const params = await context.params;
  const ncPath = params.path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${NC_URL}/${ncPath}${searchParams ? '?' + searchParams : ''}`;

  console.log('🔍 Proxy GET:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'OCS-APIRequest': 'true',
        'Accept': 'application/json',
      },
    });

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
 * Handler POST - Per ricerca, upload, PROPFIND (via header X-Method)
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  const ncPath = params.path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${NC_URL}/${ncPath}${searchParams ? '?' + searchParams : ''}`;

  const isPropfind = request.headers.get('X-Method') === 'PROPFIND';
  const method = isPropfind ? 'PROPFIND' : 'POST';

  console.log(`🔍 Proxy ${method}:`, url);

  try {
    const headers: Record<string, string> = {
      'Authorization': getAuthHeader(),
      'OCS-APIRequest': 'true',
    };

    if (isPropfind) {
      headers['Content-Type'] = 'application/xml';
      headers['Depth'] = request.headers.get('Depth') || '1';
    } else {
      headers['Accept'] = 'application/json';
    }

    // Leggi il body della richiesta (se presente)
    const body = isPropfind ? await request.text() : undefined;

    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    if (isPropfind) {
      const data = await response.text();
      return new Response(data, {
        status: response.status,
        headers: {
          'Content-Type': 'application/xml',
        },
      });
    } else {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error(`❌ Errore proxy ${method}:`, error);
    return NextResponse.json(
      { error: 'Errore connessione Nextcloud' },
      { status: 502 }
    );
  }
}

/**
 * Handler PATCH - Per aggiornamenti parziali
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  const ncPath = params.path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${NC_URL}/${ncPath}${searchParams ? '?' + searchParams : ''}`;

  console.log('🔍 Proxy PATCH:', url);

  try {
    const body = await request.text();

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': getAuthHeader(),
        'OCS-APIRequest': 'true',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Errore proxy PATCH:', error);
    return NextResponse.json(
      { error: 'Errore connessione Nextcloud' },
      { status: 502 }
    );
  }
}