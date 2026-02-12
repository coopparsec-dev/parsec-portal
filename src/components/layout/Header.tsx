'use client';

interface HeaderProps {
  userName?: string;
  userEmail?: string;
}

export default function Header({ userName = 'Utente', userEmail }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Titolo pagina */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500">Benvenuto nella intranet di progettazione</p>
        </div>

        {/* Badge utente */}
        <div className="flex items-center gap-4">
          {/* Placeholder per futura ricerca */}
          <div className="text-gray-400">
            {/* SearchBar verrà aggiunta dopo */}
          </div>

          {/* Info utente */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{userName}</p>
              {userEmail && (
                <p className="text-xs text-gray-500">{userEmail}</p>
              )}
            </div>
            
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#E94560] flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
