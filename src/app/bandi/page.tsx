// src/app/bandi/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';  // ← Cambiato
import { useBandi } from '@/hooks/useBandi';
import { formattaData, testoScadenza, getUrgenza } from '@/lib/utils/dates';
import { getColoreSettore, getColoreUrgenza } from '@/lib/utils/colors';

export default function ListaBandiPage() {
  const { bandi, isLoading, error } = useBandi();
  const searchParams = useSearchParams();
  
  const [filtroDaFare, setFiltroDaFare] = useState<string>('tutti');
  const [testoCercato, setTestoCercato] = useState<string>('');

  useEffect(() => {
    const daFareParam = searchParams.get('daFare');
    if (daFareParam === 'true') {
      setFiltroDaFare('dafare');
    }
  }, [searchParams]);

  const bandiFiltrati = useMemo(() => {
    return bandi.filter(bando => {
      if (filtroDaFare === 'dafare' && bando.daFare !== true) {
        return false;
      }
      if (filtroDaFare === 'nonprioritari' && bando.daFare !== false) {
        return false;
      }
      
      if (testoCercato.trim() !== '') {
        const testoLower = testoCercato.toLowerCase();
        const matchTitolo = bando.titolo.toLowerCase().includes(testoLower);
        const matchCommittente = bando.committente?.toLowerCase().includes(testoLower) || false;
        const matchNote = bando.note?.toLowerCase().includes(testoLower) || false;
        const matchSettore = bando.settore?.toLowerCase().includes(testoLower) || false;
        
        if (!matchTitolo && !matchCommittente && !matchNote && !matchSettore) {
          return false;
        }
      }
      
      return true;
    });
  }, [bandi, filtroDaFare, testoCercato]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Tutti i Bandi</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Tutti i Bandi</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">Errore nel caricamento dei bandi</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Tutti i Bandi</h1>
          <p className="text-gray-600">
            {bandiFiltrati.length} bandi 
            {filtroDaFare !== 'tutti' || testoCercato !== '' ? ' (filtrati)' : ' totali'}
          </p>
        </div>

        {/* Filtri */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filtri</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stato
              </label>
              <select
                value={filtroDaFare}
                onChange={(e) => setFiltroDaFare(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tutti">Tutti i bandi</option>
                <option value="dafare">✓ Da fare</option>
                <option value="nonprioritari">Non prioritari</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cerca
              </label>
              <input
                type="text"
                placeholder="Cerca per titolo, committente, settore..."
                value={testoCercato}
                onChange={(e) => setTestoCercato(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Lista Bandi */}
        <div className="bg-white rounded-lg shadow">
          {bandiFiltrati.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nessun bando trovato con i filtri selezionati
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bandiFiltrati.map(bando => {
                const urgenza = getUrgenza(bando.scadenza);
                const coloreUrgenza = getColoreUrgenza(urgenza);
                const coloreSettore = getColoreSettore(bando.settore);

                return (
                  <Link
                    key={bando.id}
                    href={`/bandi/${bando.id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-2 pt-1">
                        <div 
                          className={`w-4 h-4 rounded-full ${coloreUrgenza}`}
                          title={urgenza}
                        ></div>
                        
                        {bando.daFare && (
                          <span className="text-xs px-2 py-1 rounded font-medium bg-green-100 text-green-800">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                          {bando.titolo}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
                          {bando.settore && (
                            <span className={`px-3 py-1 rounded-full border ${coloreSettore}`}>
                              {bando.settore}
                            </span>
                          )}

                          {bando.committente && (
                            <span className="text-gray-600">
                              {bando.committente}
                            </span>
                          )}
                        </div>

                        {(bando.budgetComplessivo || bando.massimaleBudget) && (
                          <div className="text-sm text-gray-600">
                            {bando.budgetComplessivo && (
                              <span>Budget: {bando.budgetComplessivo}</span>
                            )}
                            {bando.budgetComplessivo && bando.massimaleBudget && (
                              <span className="mx-2">•</span>
                            )}
                            {bando.massimaleBudget && (
                              <span>Massimale: {bando.massimaleBudget}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        {bando.scadenza ? (
                          <>
                            <div className="text-sm font-medium text-gray-900">
                              {formattaData(bando.scadenza)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {testoScadenza(bando.scadenza)}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">
                            Nessuna scadenza
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}