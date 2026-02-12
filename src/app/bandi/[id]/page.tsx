'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ncClient } from '@/lib/nextcloud/client';
import { Bando } from '@/lib/nextcloud/types';
import { formattaData, testoScadenza, getUrgenza } from '@/lib/utils/dates';
import { getColoreSettore, getColoreUrgenza } from '@/lib/utils/colors';

export default function DettaglioBandoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [bando, setBando] = useState<Bando | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function caricaBando() {
      try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        const bandoData = await ncClient.getBando(id);
        
        if (!bandoData) {
          setError('Bando non trovato');
        } else {
          setBando(bandoData);
        }
      } catch (err) {
        setError('Errore nel caricamento del bando');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    caricaBando();
  }, [params]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento bando...</p>
        </div>
      </div>
    );
  }

  if (error || !bando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Errore</h2>
          <p className="text-red-600 mb-4">{error || 'Bando non trovato'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Torna alla Dashboard
          </button>
        </div>
      </div>
    );
  }

  const urgenza = getUrgenza(bando.scadenza);
  const coloreUrgenza = getColoreUrgenza(urgenza);
  const coloreSettore = getColoreSettore(bando.settore);

  // URL per aprire la tabella Nextcloud
  const nextcloudTableUrl = `${process.env.NEXT_PUBLIC_NEXTCLOUD_URL}/apps/tables/#/table/7`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Pulsante Indietro */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Torna indietro
        </button>

        {/* Card Principale */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header con Tag */}
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-4 h-4 rounded-full ${coloreUrgenza} mt-1`}></div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {bando.titolo}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${coloreSettore}`}>
                  {bando.settore || 'Non specificato'}
                </span>
                {bando.daFare && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border-green-300">
                    ✓ Da fare
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Informazioni Principali */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Committente */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Committente</h3>
              <p className="text-lg text-gray-900">{bando.committente || 'Non specificato'}</p>
            </div>

            {/* Scadenza */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Scadenza</h3>
              <p className="text-lg text-gray-900">
                {bando.scadenza ? (
                  <>
                    {formattaData(bando.scadenza)}
                    <span className="text-sm text-gray-600 ml-2">
                      · {testoScadenza(bando.scadenza)}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">Nessuna scadenza</span>
                )}
              </p>
            </div>

            {/* Budget Complessivo */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Budget Complessivo</h3>
              <p className="text-lg text-gray-900">{bando.budgetComplessivo || 'Non specificato'}</p>
            </div>

            {/* Massimale */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Massimale per Progetto</h3>
              <p className="text-lg text-gray-900">{bando.massimaleBudget || 'Non specificato'}</p>
            </div>
          </div>

          {/* Note */}
          {bando.note && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Note</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{bando.note}</p>
              </div>
            </div>
          )}

          {/* Azioni */}
          <div className="flex gap-3 flex-wrap">
            {bando.link && (
              
                <a href={bando.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Apri Bando Originale →
              </a>
            )}
            
              <a href={nextcloudTableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              📋 Modifica in Nextcloud
            </a>
            <button
              onClick={() => router.push('/bandi')}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Torna alla Lista Bandi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}