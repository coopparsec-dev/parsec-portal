'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCards from '@/components/dashboard/StatCards';
import BandiScadenza from '@/components/dashboard/BandiScadenza';
import ProgettiScrittura from '@/components/dashboard/ProgettiScrittura';
import { ncClient } from '@/lib/nextcloud/client';
import type { User } from '@/lib/nextcloud/types';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await ncClient.getUser();
        setUser(userData);
      } catch (error) {
        console.error('Errore caricamento utente:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <DashboardLayout
      userName={user?.displayname || 'Utente'}
      userEmail={user?.email}
      userGroups={user?.groups || ['admin']}
    >
      <div className="space-y-6">
        {/* Stat Cards */}
        <StatCards />

        {/* Griglia 2 colonne: Bandi + Progetti */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bandi in Scadenza */}
          <BandiScadenza />

          {/* Progetti in Scrittura */}
          <ProgettiScrittura />
        </div>
      </div>
    </DashboardLayout>
  );
}