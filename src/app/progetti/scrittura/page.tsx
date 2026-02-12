// src/app/progetti/scrittura/page.tsx
'use client';

import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { useProgetti } from '@/hooks/useProgetti';

export default function ProgettiScriттuraPage() {
  const { progetti, isLoading, error } = useProgetti();

  if (isLoading) {
    return (
      <PageLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Progetti in Scrittura</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold mb-6">Progetti in Scrittura</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">Errore nel caricamento dei progetti</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Progetti in Scrittura</h1>
          <p className="text-gray-600">
            {progetti.length} progett{progetti.length === 1 ? 'o' : 'i'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="divide-y divide-gray-200">
            {progetti.map((progetto) => (
              <Link
                key={progetto.fileId}
                href={`/progetti/scrittura/${encodeURIComponent(progetto.name)}`}
                className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">📁</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                      {progetto.name}
                    </h3>
                    <p className="text-sm text-gray-500">Cartella progetto</p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-blue-600">→</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}