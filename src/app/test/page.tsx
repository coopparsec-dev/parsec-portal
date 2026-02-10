'use client';

import { useEffect, useState } from 'react';

interface UserData {
  id: string;
  displayname: string;
  groups: string[];
  language: string;
  email: string | null;
}

export default function TestPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Chiama il proxy API
    fetch('/api/nc/ocs/v1.php/cloud/user')
      .then(res => res.json())
      .then(data => {
        if (data.ocs?.data) {
          setUserData(data.ocs.data);
        } else {
          setError('Formato dati non valido');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Errore di connessione: ' + err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🧪 Test Connessione Nextcloud
        </h1>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Caricamento...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}

        {userData && (
          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700 font-semibold">✅ Connessione riuscita!</p>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Dati Utente:</h2>
              
              <div className="space-y-3">
                <div className="flex border-b pb-2">
                  <span className="font-medium text-gray-600 w-32">ID:</span>
                  <span className="text-gray-800">{userData.id}</span>
                </div>

                <div className="flex border-b pb-2">
                  <span className="font-medium text-gray-600 w-32">Nome:</span>
                  <span className="text-gray-800">{userData.displayname}</span>
                </div>

                <div className="flex border-b pb-2">
                  <span className="font-medium text-gray-600 w-32">Gruppi:</span>
                  <span className="text-gray-800">
                    {userData.groups.map(g => (
                      <span key={g} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 text-sm">
                        {g}
                      </span>
                    ))}
                  </span>
                </div>

                <div className="flex border-b pb-2">
                  <span className="font-medium text-gray-600 w-32">Lingua:</span>
                  <span className="text-gray-800">{userData.language}</span>
                </div>

                <div className="flex border-b pb-2">
                  <span className="font-medium text-gray-600 w-32">Email:</span>
                  <span className="text-gray-800">{userData.email || 'Non impostata'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">
                ℹ️ Questo test conferma che:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Il proxy API funziona correttamente</li>
                <li>L'autenticazione con Nextcloud è attiva</li>
                <li>React può leggere i dati dal backend</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
