// Tipi per le risposte API Nextcloud

// Risposta wrapper OCS standard
export interface OCSResponse<T> {
  ocs: {
    meta: {
      status: string;
      statuscode: number;
      message: string;
    };
    data: T;
  };
}

// Info utente
export interface User {
  id: string;
  displayname: string;
  email: string;
  groups: string[];
  quota?: {
    free: number;
    used: number;
    total: number;
    relative: number;
  };
}

// File o cartella (da WebDAV)
export interface FileItem {
  id: string;
  fileId?: string; 
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  mtime: string; // ISO date
  mimetype?: string;
}

// Bando dalla tabella Tables
export interface Bando {
  id: number;
  settore: string | null;
  titolo: string;
  committente: string | null;
  scadenza: string | null;
  budgetComplessivo: string | null;
  massimaleBudget: string | null;
  note: string | null;
  link: string | null;
  daFare: boolean;

}

// Attività recente
export interface Activity {
  activity_id: number;
  subject: string;
  message: string;
  file: string;
  link: string;
  type: string;
  user: string;
  datetime: string; // ISO date
}
// Risposta Tables API
export interface TablesRow {
  id: number;
  data: Record<string, any>; // Dati generici, variano per tabella
}

export interface TablesResponse {
  rows: TablesRow[];
}