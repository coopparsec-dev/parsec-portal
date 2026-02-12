import useSWR from 'swr';
import { ncClient } from '@/lib/nextcloud/client';
import type { Bando } from '@/lib/nextcloud/types';

export function useBandi() {
  const { data, error, isLoading } = useSWR<Bando[]>(
    'bandi',
    () => ncClient.getBandi(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 5 * 60 * 1000, // Refresh ogni 5 minuti
    }
  );

  return {
    bandi: data || [],
    isLoading,
    error,
  };
}
