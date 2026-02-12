// src/app/progetti/scrittura/[nome]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { listFolder } from '@/lib/nextcloud/webdav';
import { FileItem } from '@/lib/nextcloud/types';

interface ProgettoDetailPageProps {
  params: Promise<{ nome: string }>;
}

export default function ProgettoDetailPage({ params }: ProgettoDetailPageProps) {
  const [nomeProgetto, setNomeProgetto] = useState<string>('');
  const [documenti, setDocumenti] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function caricaDati() {
      try {
        const resolvedParams = await params;
        const nomeDecodificato = decodeURIComponent(resolvedParams.nome);
        setNomeProgetto(nomeDecodificato);

        const pathProgetto = `Progettazione/Progetti in Scrittura/${nomeDecodificato}`;
        const files = await listFolder(pathProgetto);
        
        setDocumenti(files);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    caricaDati();
  }, [params]);

  // Dati hardcoded per ora
  const metadatiProgetto = {
    bando: 'Bandi Welfare di Comunità 2025 - Regione Lazio',
    ente: 'Regione Lazio - Assessorato Welfare',
    coordinatore: 'Dott.ssa Maria Rossi (Parsec)',
    dataPresentazione: '15 Marzo 2025',
    budgetTotale: '€ 185.000',
    tags: ['Anziani', 'Formazione', 'Inclusione'],
    partenariato: [
      { nome: 'Cooperativa Sociale Parsec', ruolo: 'CAPOFILA', budget: '€ 90.000' },
      { nome: 'Comune di Fiumicino', ruolo: 'PARTNER', budget: '€ 45.000' },
      { nome: 'APS Terzo Settore', ruolo: 'PARTNER', budget: '€ 45.000' },
    ]
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Caricamento progetto...</h1>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Errore</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{error.message}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="p-6">
        
        {/* ====== HEADER ====== */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-3">{nomeProgetto}</h1>
          <div className="flex flex-wrap gap-2">
            {metadatiProgetto.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ====== LAYOUT 2 COLONNE ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* COLONNA SINISTRA - Informazioni Progetto */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              📋 Informazioni Progetto
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Bando di Riferimento</dt>
                <dd className="text-gray-900">{metadatiProgetto.bando}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ente Finanziatore</dt>
                <dd className="text-gray-900">{metadatiProgetto.ente}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Coordinatore</dt>
                <dd className="text-gray-900">{metadatiProgetto.coordinatore}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Data Presentazione</dt>
                <dd className="text-gray-900">{metadatiProgetto.dataPresentazione}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Budget Totale</dt>
                <dd className="text-lg font-bold text-gray-900">{metadatiProgetto.budgetTotale}</dd>
              </div>
            </dl>
          </div>

          {/* COLONNA DESTRA - Partenariato */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              🤝 Partenariato
            </h2>
            <div className="space-y-3">
              {metadatiProgetto.partenariato.map((partner, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    partner.ruolo === 'CAPOFILA'
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">{partner.nome}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        partner.ruolo === 'CAPOFILA'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-white'
                      }`}
                    >
                      {partner.ruolo}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{partner.budget}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

          </div>

        {/* ====== ABSTRACT PROGETTO ====== */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            📝 Abstract Progetto
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Il progetto "Inclusione Digitale per Anziani" si propone di ridurre il divario digitale 
            tra gli anziani del territorio, attraverso percorsi formativi personalizzati. L'iniziativa 
            prevede la realizzazione di 120 ore di formazione a supporto nell'uso di servizi digitali 
            pubblici e la creazione di una rete di supporto tra pari. Il progetto prevede la 
            formazione di 120 anziani con età dai 65-75 anni, con particolare attenzione alla fascia più vulnerabile.
          </p>
        </div>

        {/* ====== VALUTAZIONE PROGETTO ====== */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            ⭐ Valutazione Progetto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Punteggio grande */}
            <div className="md:col-span-1 flex flex-col items-center justify-center bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <div className="text-sm text-gray-600 mb-1">Punteggio Totale</div>
              <div className="text-5xl font-bold text-green-600">87/100</div>
            </div>

            {/* Info valutazione */}
            <div className="md:col-span-3 space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Data Valutazione</dt>
                <dd className="text-gray-900">28 Aprile 2025</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Commissione</dt>
                <dd className="text-gray-900">Commissione Tecnica Regionale</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Documenti Valutazione</dt>
                <dd>
                  
                    <a href="#"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    📄 Scheda_Valutazione_PR20250443.pdf
                  </a>
                </dd>
              </div>
            </div>
          </div>
      
        {/* ====== DOCUMENTI PROGETTO ====== */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            📁 Documenti Progetto
          </h2>

          {/* Grid 3 categorie */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CATEGORIA 1 - Formulari */}
            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-900">
                  📋 Formulari e Documenti Ufficiali
                </h3>
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                  {documenti.filter(d => d.type === 'file' && d.name.includes('Formulario')).length}
                </span>
              </div>
              <ul className="space-y-2">
                {documenti
                  .filter(d => d.type === 'file')
                  .slice(0, 4)
                  .map((doc) => (
                    <li key={doc.fileId} className="text-sm text-gray-700 flex items-start gap-2">
                      <span>📄</span>
                      <span className="flex-1 truncate">{doc.name}</span>
                    </li>
                  ))}
                {documenti.filter(d => d.type === 'file').length > 4 && (
                  <li className="text-sm text-blue-600 font-medium">
                    + {documenti.filter(d => d.type === 'file').length - 4} altri file...
                  </li>
                )}
              </ul>
            </div>

            {/* CATEGORIA 2 - Documenti Partners */}
            <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-orange-900">
                  🤝 Documenti Partners
                </h3>
                <span className="bg-orange-600 text-white px-2 py-1 rounded text-sm font-bold">
                  {Math.floor(documenti.length / 3)}
                </span>
              </div>
              <ul className="space-y-2">
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span>📄</span>
                  <span>Mandato_Comune_Fiumicino.pdf</span>
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span>📄</span>
                  <span>Statuto_APS_Terzo.pdf</span>
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span>📄</span>
                  <span>Bilanci_Partners_2024.zip</span>
                </li>
              </ul>
            </div>

            {/* CATEGORIA 3 - Allegati Tecnici */}
            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-900">
                  🔧 Allegati Tecnici
                </h3>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                  {Math.floor(documenti.length / 3)}
                </span>
              </div>
              <ul className="space-y-2">
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span>📄</span>
                  <span>Analisi_Bisogni_Territorio.pdf</span>
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span>📄</span>
                  <span>Studio_Fattibilità.docx</span>
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span>📊</span>
                  <span>Mappatura_Risorse_Locali.xlsx</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Link "Vedi tutti" */}
          <div className="mt-6 text-center">
            
             <a href={`http://localhost:8080/apps/files/?dir=/Progettazione/Progetti%20in%20Scrittura/${encodeURIComponent(nomeProgetto)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Vedi tutti i documenti in Nextcloud →
            </a>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}