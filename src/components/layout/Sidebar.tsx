'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SidebarProps {
  userGroups?: string[]; // Gruppi utente per mostrare solo le aree accessibili
}

export default function Sidebar({ userGroups = ['admin'] }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Le 5 aree documentali di Parsec
  const areas = [

    {
      name: 'Home',
      icon: '🏠',
      path: '/',
      groups: ['admin', 'Progettisti', 'Cda'], // Chi può accedere
    },

    {
      name: 'Progettazione',
      icon: '✏️',
      path: '/progettazione',
      groups: ['admin', 'Progettisti', 'Cda'], // Chi può accedere
    },
    {
      name: 'Progetti Attivi',
      icon: '🚀',
      path: '/progetti',
      groups: ['admin', 'Progettisti', 'Coordinatori'],
    },
    {
      name: 'Formazione e Ricerca',
      icon: '📚',
      path: '/formazione',
      groups: ['admin', 'Progettisti', 'Coordinatori', 'Cda'],
    },
    {
      name: 'Bandi e Opportunità',
      icon: '📋',
      path: '/bandi',
      groups: ['admin', 'Progettisti', 'Cda'],
    },
    {
      name: 'Comunicazioni Interne',
      icon: '📢',
      path: '/comunicazioni',
      groups: ['admin', 'Progettisti', 'Coordinatori', 'Cda'],
    },
  ];

  // Filtra le aree in base ai gruppi utente
  const accessibleAreas = areas.filter(area =>
    area.groups.some(group => userGroups.includes(group))
  );

  return (
    <aside
      className={`
        bg-[#1A1A2E] text-white h-screen sticky top-0
        transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Header Sidebar */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold">Parsec</h1>
              <p className="text-xs text-gray-400">Intranet progettazione</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-700 rounded"
            aria-label={isCollapsed ? 'Espandi' : 'Comprimi'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* Menu Aree */}
      <nav className="p-2">
        <ul className="space-y-1">
          {accessibleAreas.map((area) => (
            <li key={area.path}>
              <Link
                href={area.path}
                className="flex items-center gap-3 p-3 rounded hover:bg-[#0F3460] transition-colors group"
              >
                <span className="text-2xl">{area.icon}</span>
                {!isCollapsed && (
                  <span className="text-sm font-medium">{area.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Sidebar */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Parsec Cooperativa Sociale
          </p>
        </div>
      )}
    </aside>
  );
}
