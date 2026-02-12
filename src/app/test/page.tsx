'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/nc/ocs/v1.php/cloud/user', {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Caricamento...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Errore: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Connessione Nextcloud</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">✅ Connessione OK</h2>
          
          <div className="space-y-4">
            <div>
              <span className="font-semibold">User ID:</span> {userData?.ocs?.data?.id}
            </div>
            <div>
              <span className="font-semibold">Nome:</span> {userData?.ocs?.data?.displayname}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {userData?.ocs?.data?.email}
            </div>
            <div>
              <span className="font-semibold">Gruppi:</span>
              <ul className="ml-4 mt-2">
                {userData?.ocs?.data?.groups?.map((group: string) => (
                  <li key={group} className="text-blue-600">• {group}</li>
                ))}
              </ul>
            </div>
          </div>

          <details className="mt-6">
            <summary className="cursor-pointer text-gray-600">Dati grezzi JSON</summary>
            <pre className="mt-4 bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}