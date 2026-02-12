// src/components/layout/PageLayout.tsx
'use client';

import Sidebar from './Sidebar';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - gestisce stato interno */}
      <Sidebar />
      
      {/* Contenuto principale */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
