// Wrapper per chiamate API Nextcloud
import type { OCSResponse, User, Activity, Bando } from './types';

class NextcloudClient {
  private baseUrl = '/api/nc'; // Proxy Next.js

  /**
   * Fetch generico con gestione errori
   */
  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Nextcloud API error:', error);
      throw error;
    }
  }

  /**
   * Ottieni info utente corrente
   */
  async getUser(): Promise<User> {
    const response = await this.fetch<OCSResponse<User>>('/ocs/v1.php/cloud/user');
    return response.ocs.data;
  }

  /**
   * Ottieni attività recenti
   */
  async getActivity(limit: number = 10): Promise<Activity[]> {
    const response = await this.fetch<OCSResponse<Activity[]>>(
      `/ocs/v2.php/apps/activity/api/v2/activity/all?limit=${limit}`
    );
    return response.ocs.data;
  }

  /**
   * Ottieni bandi dalla tabella Nextcloud Tables
   * Prova vari endpoint fino a trovarne uno funzionante
   */
  async getBandi(): Promise<Bando[]> {
    const tableId = 7;
    
    // Endpoint da testare in ordine
    const endpoints = [
      `/ocs/v2.php/apps/tables/api/1/tables/${tableId}/rows`,
      `/index.php/apps/tables/api/1/tables/${tableId}/rows`,
      `/ocs/v2.php/apps/tables/api/2/tables/${tableId}/rows`,
      `/ocs/v1.php/apps/tables/api/1/tables/${tableId}/rows`,
    ];

    // Prova ogni endpoint
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Testing endpoint: ${endpoint}`);
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Endpoint funzionante:', endpoint);
          console.log('📦 Dati ricevuti:', data);
          
          // Parsing della risposta
          return this.parseBandiResponse(data);
        }
      } catch (error) {
        console.log(`❌ Endpoint fallito: ${endpoint}`);
      }
    }

    throw new Error('Nessun endpoint Tables API funzionante trovato');
  }

  /**
   * Ottiene un singolo bando per ID
   */
  async getBando(id: number): Promise<Bando | null> {
    const bandi = await this.getBandi();
    return bandi.find(bando => bando.id === id) || null;
  }

  /**
   * Parser per risposta Tables API
   */
  private parseBandiResponse(data: any): Bando[] {
  if (!Array.isArray(data)) {
    console.error('Risposta non è un array:', data);
    return [];
  }

  return data.map((row: any) => {
    const values: Record<number, string> = {};
    row.data.forEach((item: any) => {
      values[item.columnId] = item.value || '';
    });

    return {
      id: row.id,
      settore: values[56] || null,
      titolo: values[57] || '',
      committente: values[58] || null,
      scadenza: values[59] || null,
      budgetComplessivo: values[60] || null,
      massimaleBudget: values[61] || null,
      note: values[62] || null,
      link: values[63] || null,
      daFare: values[70] === 'true',  // ← CAMBIATO (converte stringa in booleano)
    };
  });
}
/**
 * Aggiorna il campo "Da lavorare" di un bando
 */
async updateBandodaFare(
  bandoId: number, 
  valore: 'Si' | 'Forse' | 'No' | null
): Promise<boolean> {
  const tableId = 7;
  
  try {
    const response = await fetch(
      `${this.baseUrl}/index.php/apps/tables/api/1/tables/${tableId}/rows/${bandoId}`,
      {
        method: 'PATCH',  // ← CAMBIATO DA PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [
            {
              columnId: 64,
              value: valore || ''
            }
          ]
        })
      }
    );

    if (!response.ok) {
      console.error('Errore update bando:', response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Errore update bando:', error);
    return false;
  }
}

}

// Export istanza singleton
export const ncClient = new NextcloudClient();