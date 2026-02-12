import useSWR from 'swr';
import { listFolder } from '@/lib/nextcloud/webdav';
import type { FileItem } from '@/lib/nextcloud/types';

export function useProgetti() {
  const { data, error, isLoading } = useSWR<FileItem[]>(
    'progetti-scrittura',
    () => listFolder('Progettazione/Progetti in Scrittura'),
    {
      revalidateOnFocus: false,
      refreshInterval: 5 * 60 * 1000, // Refresh ogni 5 minuti
    }
  );

  // Filtra solo le cartelle (non i file)
  const cartelle = data?.filter(item => item.type === 'directory') || [];

  return {
    progetti: cartelle,
    count: cartelle.length,
    isLoading,
    error,
  };
}

