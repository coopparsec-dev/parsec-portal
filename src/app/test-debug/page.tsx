// src/app/test-debug/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function TestDebugPage() {
  const [tests, setTests] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runTests() {
      const results: any = {};

      // Test 1: Ping
      try {
        const res = await fetch('/api/test-ping');
        results.ping = await res.json();
      } catch (e: any) {
        results.ping = { error: e.message };
      }

      // Test 2: Env
      try {
        const res = await fetch('/api/test-env');
        results.env = await res.json();
      } catch (e: any) {
        results.env = { error: e.message };
      }

      // Test 3: Database Debug
      try {
        const res = await fetch('/api/test-db-debug');
        results.dbDebug = await res.json();
      } catch (e: any) {
        results.dbDebug = { error: e.message };
      }

      // Test 4: Database Originale
      try {
        const res = await fetch('/api/test-db');
        results.dbOriginal = await res.json();
      } catch (e: any) {
        results.dbOriginal = { error: e.message };
      }

      setTests(results);
      setLoading(false);
    }

    runTests();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🔍 Test Debug in corso...</h1>
        <p>Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🔍 Debug Dashboard</h1>

      {Object.entries(tests).map(([name, data]) => (
        <div key={name} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">
            {name === 'ping' && '📡 Test API Ping'}
            {name === 'env' && '🔐 Test Variabili Ambiente'}
            {name === 'dbDebug' && '🗄️ Test Database (Debug)'}
            {name === 'dbOriginal' && '💾 Test Database (Originale)'}
          </h2>
          <pre className="bg-white p-3 rounded overflow-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}

