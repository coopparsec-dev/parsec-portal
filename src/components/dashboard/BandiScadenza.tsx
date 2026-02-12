'use client';

import Link from 'next/link';
import { useBandi } from '@/hooks/useBandi';
import { getUrgenza, formattaData, testoScadenza } from '@/lib/utils/dates';
import { getColoreSettore, getColoreUrgenza } from '@/lib/utils/colors';

export default function BandiScadenza() {
  const { bandi, isLoading, error } = useBandi();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Bandi in Scadenza</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3 p-3 bg-gray-50 rounded">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Bandi in Scadenza</h3>
        <div className="text-red-600 text-sm">Errore caricamento bandi</div>
      </div>
    );
  }

  // Filtra bandi con scadenza nei prossimi 60 giorni
  const oggi = new Date();
  const tra60giorni = new Date();
  tra60giorni.setDate(oggi.getDate() + 60);

  const bandiInScadenza = bandi
    .filter(bando => {
      if (!bando.scadenza) return false;
      const scadenza = new Date(bando.scadenza);
      return scadenza >= oggi && scadenza <= tra60giorni;
    })
    .sort((a, b) => {
      // Ordina per data di scadenza (prima i più urgenti)
      const dataA = new Date(a.scadenza!);
      const dataB = new Date(b.scadenza!);
      return dataA.getTime() - dataB.getTime();
    });

  if (bandiInScadenza.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Bandi in Scadenza</h3>
        <p className="text-gray-500 text-sm">Nessun bando in scadenza nei prossimi 60 giorni</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">📋 Bandi in Scadenza</h3>
        <span className="text-sm text-gray-500">(prossimi 60 giorni)</span>
      </div>

      <div className="space-y-3">
        {bandiInScadenza.map((bando) => {
          const urgenza = getUrgenza(bando.scadenza);
          const coloreUrgenza = getColoreUrgenza(urgenza);
          const coloreSettore = getColoreSettore(bando.settore);

          return (
            <Link
              key={bando.id}
              href={`/bandi/${bando.id}`}
              className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 cursor-pointer block"
            >
              {/* Bollino semaforo urgenza */}
              <div className="flex-shrink-0 pt-1">
                <div 
                  className={`w-3 h-3 rounded-full ${coloreUrgenza}`}
                  title={urgenza}
                ></div>
              </div>

              {/* Contenuto bando */}
              <div className="flex-1 min-w-0">
                {/* Titolo */}
                <div className="mb-1">
                  <p className="font-medium text-gray-900 hover:text-blue-600 text-sm line-clamp-2">
                    {bando.titolo}
                  </p>
                </div>

                {/* Riga info: Tag settore + Committente + Scadenza */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Tag settore */}
                  {bando.settore && (
                    <span className={`px-2 py-0.5 rounded border ${coloreSettore}`}>
                      {bando.settore}
                    </span>
                  )}

                  {/* Committente */}
                  {bando.committente && (
                    <span className="text-gray-600">
                      {bando.committente}
                    </span>
                  )}

                  {/* Scadenza */}
                  {bando.scadenza && (
                    <span className="text-gray-900 font-medium ml-auto">
                      {formattaData(bando.scadenza)} · {testoScadenza(bando.scadenza)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}