'use client';

import { useProgetti } from '@/hooks/useProgetti';

export default function ProgettiScrittura() {
  const { progetti, isLoading, error } = useProgetti();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📁 Progetti in Scrittura</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3 p-3 bg-gray-50 rounded">
              <div className="w-10 h-10 bg-gray-300 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📁 Progetti in Scrittura</h3>
        <div className="text-red-600 text-sm">Errore caricamento progetti</div>
      </div>
    );
  }

  if (progetti.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📁 Progetti in Scrittura</h3>
        <p className="text-gray-500 text-sm">Nessun progetto in fase di scrittura</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">📁 Progetti in Scrittura</h3>
        <span className="text-sm text-gray-500">{progetti.length}</span>
      </div>

      <div className="space-y-2">
        {progetti.map((progetto) => {
          const nextcloudUrl = `${process.env.NEXT_PUBLIC_NEXTCLOUD_URL}/apps/files/files/${progetto.fileId}?dir=/Progettazione/Progetti%20in%20Scrittura`;

          return (
            <a
              key={progetto.fileId}
              href={nextcloudUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 group"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-xl">📁</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 group-hover:text-blue-600 truncate">
                  {progetto.name}
                </p>
              </div>

              <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <a
          href={`${process.env.NEXT_PUBLIC_NEXTCLOUD_URL}/apps/files/?dir=/Progettazione/Progetti%20in%20Scrittura`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Vedi tutti in Nextcloud
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}