/**
 * Mappa settori → colori Tailwind
 * Basata sui settori reali della tabella Monitoraggio Bandi
 */
export const COLORI_SETTORE: Record<string, string> = {
  // MINORI E GIOVANI (Rosso/Rosa)
  'minori': 'bg-red-100 text-red-800 border-red-300',
  'minori e giovani': 'bg-rose-100 text-rose-800 border-rose-300',
  
  // IMMIGRAZIONE (Blu)
  'immigrazione': 'bg-blue-100 text-blue-800 border-blue-300',
  
  // FORMAZIONE E EDUCAZIONE (Giallo/Ambra)
  'formazione': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'educazione/istruzione': 'bg-amber-100 text-amber-800 border-amber-300',
  
  // GENERE E PARI OPPORTUNITÀ (Fucsia/Viola)
  'parità di genere': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
  'pari opportunità': 'bg-purple-100 text-purple-800 border-purple-300',
  
  // SOCIALE (Teal)
  'inclusione sociale': 'bg-teal-100 text-teal-800 border-teal-300',
  'economia sociale': 'bg-cyan-100 text-cyan-800 border-cyan-300',
  'famiglia, anziani, occupazione, disabilità e povertà': 'bg-teal-100 text-teal-800 border-teal-300',
  
  // SALUTE (Rosa)
  'salute': 'bg-pink-100 text-pink-800 border-pink-300',
  
  // AMBIENTE (Verde)
  'ambiente': 'bg-green-100 text-green-800 border-green-300',
  
  // SVILUPPO IMPRESA (Lime/Verde chiaro)
  'sviluppo impresa': 'bg-lime-100 text-lime-800 border-lime-300',
  'sviluppo d\'impresa': 'bg-lime-100 text-lime-800 border-lime-300',
  
  // PARTECIPAZIONE (Indigo)
  'partecipazione': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  
  // VARIE (Grigio)
  'varie': 'bg-gray-100 text-gray-800 border-gray-300',
};

/**
 * Colore di default per settori non mappati
 */
export const COLORE_DEFAULT = 'bg-gray-100 text-gray-800 border-gray-300';

/**
 * Restituisce le classi Tailwind per un dato settore
 */
export function getColoreSettore(settore: string | null): string {
  if (!settore) return COLORE_DEFAULT;
  
  const settoreLower = settore.toLowerCase();
  return COLORI_SETTORE[settoreLower] || COLORE_DEFAULT;
}

/**
 * Colori per il semaforo urgenza
 */
export const COLORI_URGENZA = {
  rosso: 'bg-red-500',
  arancione: 'bg-orange-500',
  giallo: 'bg-yellow-500',
  verde: 'bg-green-500',
  nessuna: 'bg-gray-300',
};

export function getColoreUrgenza(urgenza: 'rosso' | 'arancione' | 'giallo' | 'verde' | 'nessuna'): string {
  return COLORI_URGENZA[urgenza];
}
