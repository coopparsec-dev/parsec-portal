// src/app/bandi/page.tsx
'use client';

import { Suspense } from 'react';
import ListaBandiClient from './ListaBandiClient';
import PageLayout from '@/components/layout/PageLayout';

export const dynamic = 'force-dynamic';

function LoadingFallback() {
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

export default function ListaBandiPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ListaBandiClient />
    </Suspense>
  );
}