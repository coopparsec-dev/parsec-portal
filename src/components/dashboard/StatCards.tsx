'use client';

import { useBandi } from '@/hooks/useBandi';
import { useProgetti } from '@/hooks/useProgetti';
import Link from 'next/link';


export default function StatCards() {
  const { bandi, isLoading: isLoadingBandi, error: errorBandi } = useBandi();
  const { count: progettiCount, isLoading: isLoadingProgetti, error: errorProgetti } = useProgetti();

  const isLoading = isLoadingBandi || isLoadingProgetti;
  const error = errorBandi || errorProgetti;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Errore caricamento statistiche
      </div>
    );
  }

  // Calcola i numeri
  const totaleBandi = bandi.length;


  // Calcola bandi da lavorare
  const bandiDaLavorare = bandi.filter(bando => bando.daFare === true).length;

  
  // Bandi in scadenza nei prossimi 60 giorni
  const oggi = new Date();
  const tra60giorni = new Date();
  tra60giorni.setDate(oggi.getDate() + 60);
  
  const bandiInScadenza = bandi.filter(bando => {
    if (!bando.scadenza) return false;
    const scadenza = new Date(bando.scadenza);
    return scadenza >= oggi && scadenza <= tra60giorni;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card 1 - Bandi Totali (CLICCABILE) */}
      <Link 
        href="/bandi"
        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Bandi Totali</p>
            {isLoadingBandi ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold text-gray-900">{bandi.length}</p>
            )}
          </div>
          <div className="text-4xl">📊</div>
        </div>
      </Link>

  {/* Card 2 - Bandi da Lavorare  */}
    <Link
  href="/bandi?daFare=true"  // ← Aggiunto parametro query
  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-600 mb-1">Bandi da Lavorare</p>
      {isLoadingBandi ? (
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
      ) : (
        <p className="text-3xl font-bold text-green-600">{bandiDaLavorare}</p>
      )}
    </div>
    <div className="text-4xl">✅</div>
  </div>
</Link>


      {/* Card 2: Bandi in Scadenza */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Bandi in Scadenza</p>
            <p className="text-xs text-gray-500 mb-2">(prossimi 60 giorni)</p>
            <p className="text-3xl font-bold text-orange-600">{bandiInScadenza}</p>
          </div>
          <div className="text-4xl">⏰</div>
        </div>
      </div>

      {/* Card 3: Progetti in Scrittura */}
      <Link
  href="/progetti/scrittura"
  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-600 mb-1">Progetti in Scrittura</p>
      {isLoadingProgetti ? (
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
      ) : (
        <p className="text-3xl font-bold text-blue-600">{progettiCount}</p>
      )}
    </div>
    <div className="text-4xl">✏️</div>
  </div>
</Link>
    </div>
  );
}