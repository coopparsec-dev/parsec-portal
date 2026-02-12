// src/app/test-db/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function TestDB() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/test-db')
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">⏳ Caricamento...</div>;
  if (error) return <div className="p-8 text-red-600">❌ Errore: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Connessione Database</h1>
      
      {data?.success ? (
        <div className="space-y-4">
          <p className="text-green-600 font-bold">✅ {data.message}</p>
          <p className="text-gray-600">Ora server: {new Date(data.current_time).toLocaleString()}</p>
          <p className="text-gray-600">Progetti trovati: {data.progetti_count}</p>
          
          {data.progetti && data.progetti.length > 0 && (
            <div className="bg-gray-50 p-4 rounded">
              <h2 className="font-bold mb-2">Dati progetti:</h2>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(data.progetti, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="text-red-600">
          <p className="font-bold">❌ Errore database:</p>
          <pre className="text-xs bg-red-50 p-4 rounded mt-2">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
