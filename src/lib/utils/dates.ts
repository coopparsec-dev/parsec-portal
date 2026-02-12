/**
 * Calcola i giorni tra oggi e una data futura
 */
export function giorniMancanti(dataScadenza: string | null): number | null {
  if (!dataScadenza) return null;
  
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0); // Azzera ore per confronto pulito
  
  const scadenza = new Date(dataScadenza);
  scadenza.setHours(0, 0, 0, 0);
  
  const differenzaMs = scadenza.getTime() - oggi.getTime();
  const differenzaGiorni = Math.ceil(differenzaMs / (1000 * 60 * 60 * 24));
  
  return differenzaGiorni;
}

/**
 * Calcola il livello di urgenza in base ai giorni mancanti
 */
export function getUrgenza(dataScadenza: string | null): 'rosso' | 'arancione' | 'giallo' | 'verde' | 'nessuna' {
  const giorni = giorniMancanti(dataScadenza);
  
  if (giorni === null) return 'nessuna';
  if (giorni < 0) return 'nessuna'; // Scaduto
  if (giorni < 14) return 'rosso';
  if (giorni < 30) return 'arancione';
  if (giorni < 60) return 'giallo';
  return 'verde';
}

/**
 * Formatta una data in italiano: "15 mar 2025"
 */
export function formattaData(data: string | null): string {
  if (!data) return 'Nessuna scadenza';
  
  const d = new Date(data);
  const mesi = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  
  return `${d.getDate()} ${mesi[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Testo "tra X giorni" o "scaduto"
 */
export function testoScadenza(dataScadenza: string | null): string {
  const giorni = giorniMancanti(dataScadenza);
  
  if (giorni === null) return '';
  if (giorni < 0) return 'Scaduto';
  if (giorni === 0) return 'Scade oggi!';
  if (giorni === 1) return 'Scade domani';
  return `Tra ${giorni} giorni`;
}
