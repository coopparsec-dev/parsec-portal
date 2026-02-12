// src/app/test-tables/page.tsx
'use client';

import { useState } from 'react';

export default function TestTablesPage() {
  const [risultato, setRisultato] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Test WebDAV PUT - Crea file JSON
  async function testCreaFileJSON() {
    setLoading(true);
    setRisultato('');

    const metadata = {
      bando: "Test Bando",
      ente: "Test Ente",
      budget: "€ 10.000"
    };

    const jsonContent = JSON.stringify(metadata, null, 2);

    try {
      const response = await fetch(
        '/api/nc/remote.php/dav/files/admin/Progettazione/test-metadata.json',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonContent
        }
      );

      if (response.ok) {
        setRisultato('✅ File JSON creato con successo!\n\nVai su Nextcloud → Progettazione/test-metadata.json per verificare!');
      } else {
        setRisultato(`❌ Errore: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setRisultato('❌ Errore: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Test WebDAV PUT</h1>

      {/* Risultati test precedenti */}
      <div className="space-y-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-bold text-red-900">❌ Opzioni Scartate:</h3>
          <ul className="text-sm text-red-800 mt-2 space-y-1">
            <li>• Tables API POST → Status 500</li>
            <li>• Iframe Nextcloud → X-Frame-Options blocked</li>
            <li>• Forms → Non si integra con Tables</li>
            <li>• Tables UI → Poco user-friendly</li>
          </ul>
        </div>
      </div>

      {/* Test WebDAV */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">💾 Test: Scrivere File JSON via WebDAV</h2>
        <p className="text-gray-600 mb-4">
          Se funziona, possiamo creare form nel portale che salva metadata.json direttamente nelle cartelle progetto!
        </p>
        <button
          onClick={testCreaFileJSON}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Caricamento...' : '📝 Crea File test-metadata.json'}
        </button>
      </div>

      {/* Risultato */}
      {risultato && (
        <div className={`rounded-lg p-6 font-mono text-sm whitespace-pre-wrap ${
          risultato.includes('✅') 
            ? 'bg-green-50 text-green-900 border border-green-200' 
            : 'bg-red-50 text-red-900 border border-red-200'
        }`}>
          {risultato}
        </div>
      )}

      {/* Prossimi passi */}
      {risultato.includes('✅') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold mb-2">🎉 Se funziona, possiamo:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Creare form bellissimo nel portale React</li>
            <li>Click "Salva" → scrive metadata.json nella cartella progetto</li>
            <li>Portale legge il JSON e mostra i dati</li>
            <li>User-friendly per i progettisti!</li>
          </ol>
        </div>
      )}
    </div>
  );
}