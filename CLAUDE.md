# CLAUDE.md — Portale Documentale Parsec

## Progetto
App web React/Next.js che funge da portale documentale per Parsec Cooperativa Sociale (Roma).
Si integra con un'istanza Nextcloud Hub 31 esistente come backend per file, permessi, database bandi e ricerca.

## Stack Tecnologico
- **Frontend**: Next.js 14+ / React 18+ / TypeScript / Tailwind CSS
- **Backend**: Nextcloud Hub 31.0.13 (PostgreSQL 16, Redis 7, Elasticsearch 8.15, OnlyOffice 8.2)
- **Infrastruttura**: Docker Compose — il frontend è un container aggiuntivo nello stack esistente
- **Autenticazione**: OAuth2 via Nextcloud

## Struttura del Repository
```
parsec-portal/
├── CLAUDE.md                 # Questo file
├── docker-compose.yml        # Solo il container frontend (si collega alla rete parsec)
├── Dockerfile
├── .env.local                # Variabili ambiente (NEXTCLOUD_URL, OAuth client/secret)
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout con sidebar
│   │   ├── page.tsx          # Dashboard principale
│   │   ├── login/page.tsx    # Pagina login
│   │   ├── callback/page.tsx # OAuth callback
│   │   ├── progetti/
│   │   │   ├── page.tsx      # Lista progetti
│   │   │   └── [id]/page.tsx # Scheda progetto singolo
│   │   ├── bandi/page.tsx    # Monitoraggio bandi completo
│   │   └── api/              # API routes (proxy verso Nextcloud)
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── nc/[...path]/route.ts   # Proxy generico NC API
│   │       └── search/route.ts         # Proxy ricerca
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── dashboard/
│   │   │   ├── StatCards.tsx
│   │   │   ├── BandiScadenza.tsx
│   │   │   ├── ProgettiLavorazione.tsx
│   │   │   └── FileRecenti.tsx
│   │   ├── progetti/
│   │   │   ├── SchedaProgetto.tsx
│   │   │   ├── DocumentiProgetto.tsx
│   │   │   └── Partenariato.tsx
│   │   └── ui/               # Componenti generici (Card, Badge, Tag, Spinner)
│   ├── lib/
│   │   ├── nextcloud/
│   │   │   ├── client.ts     # Client API Nextcloud (wrapper fetch con auth)
│   │   │   ├── webdav.ts     # Operazioni WebDAV (PROPFIND, liste cartelle)
│   │   │   ├── tables.ts     # API Nextcloud Tables (bandi)
│   │   │   ├── search.ts     # Full-text search (Elasticsearch via NC)
│   │   │   ├── activity.ts   # Activity API (file recenti)
│   │   │   └── types.ts      # TypeScript interfaces per tutte le risposte API
│   │   ├── auth/
│   │   │   ├── oauth.ts      # Configurazione OAuth2
│   │   │   └── session.ts    # Gestione sessione/token
│   │   └── utils/
│   │       ├── dates.ts      # Formattazione date italiane, calcolo urgenza
│   │       └── permissions.ts # Mappatura gruppi NC → ruoli portale
│   ├── hooks/
│   │   ├── useUser.ts        # Hook per dati utente corrente
│   │   ├── useBandi.ts       # Hook per lista bandi con cache SWR
│   │   ├── useProgetti.ts    # Hook per cartelle progetto
│   │   └── useSearch.ts      # Hook per ricerca
│   └── types/
│       └── index.ts          # Tipi globali (User, Bando, Progetto, FileItem)
├── public/
│   └── logo-parsec.svg
└── tailwind.config.ts
```

## Nextcloud Backend — Configurazione Esistente

### Credenziali di test (ambiente locale)
- URL: `http://localhost:8080` (container `parsec-nextcloud`)
- Admin: `admin` / `Parsec@2026`
- Network Docker: `parsec-intranet_default`

### Gruppi Utenti
| Gruppo | Ruolo nel portale | Utenti test |
|--------|-------------------|-------------|
| admin | Amministratore | admin |
| Cda | Consiglio di Amministrazione | barbara.guadagni |
| Progettisti | Progettisti (accesso completo) | carmen.silipo, guido.ricci |
| Coordinatori | Coordinatori di progetto | coordinatore.test1 |

### Group Folders (ID → nome → permessi)
| ID | Nome | Accesso |
|----|------|---------|
| 1 | Progettazione | CdA(full), Progettisti(rw), Admin(full) |
| 2 | Progetti Attivi | Progettisti(rw), Admin(full) |
| 3 | Formazione e Ricerca | CdA(full), Progettisti(rw), Coordinatori(r) |
| 4 | Bandi e Opportunità | CdA(full), Progettisti(rw), Admin(full) |
| 5 | Comunicazioni Interne | CdA(rws), Coordinatori(rs), Progettisti(r) |

### Nextcloud Tables — Database Bandi
- **Tabella**: "Monitoraggio Bandi" (ID: **7**, 31 righe)
- **App version**: tables 1.0.3

**Colonne**: Settore bando, Titolo e oggetto, Committente, Scadenza (date YYYY-MM-DD o vuoto), Budget complessivo, Massimale budget per progetto, Note, Link

**21 categorie settore**: ambiente, carcere, cooperazione internazionale, comunicazione, cultura, dipendenze, disabilità, formazione, minori e giovani, immigrazione e asilo, inserimento lavorativo, invecchiamento attivo, pari opportunità, protezione civile, ricerca sociale, salute, servizi sociali, sicurezza e legalità, sviluppo impresa, sviluppo locale, tratta e prostituzione

## API Nextcloud — Riferimento

### ✅ API Funzionanti (verificate)
```
GET  /ocs/v1.php/cloud/user                              → Info utente, gruppi
GET  /ocs/v2.php/apps/activity/api/v2/activity/all       → Stream attività
PROPFIND /remote.php/dav/files/{user}/{path}/             → Lista cartelle/file (WebDAV)
POST /ocs/v2.php/search/providers/files/search            → Ricerca unificata
POST /apps/fulltextsearch/v1/search                       → Full-text search (Elasticsearch)
```

### ⚠️ API Tables — Problema Noto
Tables 1.0.3 su NC31 restituisce **404** sugli endpoint API v2:
```
GET /ocs/v2.php/apps/tables/api/2/columns?tableId=7      → 404 ❌
GET /ocs/v2.php/apps/tables/api/2/rows?tableId=7         → 404 ❌
```
**Da risolvere in Fase 0**: trovare l'endpoint corretto. Possibili path da testare:
```
/ocs/v2.php/apps/tables/api/1/tables/7/columns
/ocs/v2.php/apps/tables/api/1/tables/7/rows
/index.php/apps/tables/api/1/tables/7/columns
/apps/tables/api/1/columns/7
```
Se nessun endpoint API funziona, fallback: esportare CSV periodicamente e servire dati statici.

### Autenticazione API
- **Da server (curl interno)**: Basic Auth con header `OCS-APIRequest: true`
- **Da browser (fetch JS)**: Serve il `requesttoken` CSRF di Nextcloud oppure OAuth2
- **WebDAV dal browser**: Restituisce 401 senza requesttoken → risolvere con proxy Next.js

**Soluzione architetturale**: tutte le chiamate API passano tramite le API routes di Next.js (`/api/nc/[...path]`), che aggiungono le credenziali server-side. Il frontend non tocca mai direttamente le API Nextcloud.

## Regole di Sviluppo

### Convenzioni Codice
- TypeScript strict mode, nessun `any`
- Componenti React funzionali con hooks
- File naming: kebab-case per file, PascalCase per componenti
- Commenti in italiano per logica di business, inglese per codice tecnico
- Tutti i testi UI in italiano

### Convenzioni UI
- Palette colori: primary `#1A1A2E`, secondary `#0F3460`, accent `#E94560`
- Font: system font stack (come Nextcloud)
- Semaforo urgenza bandi: rosso (<14gg), arancione (<30gg), giallo (<60gg), verde (>60gg)
- Tag settore: colore mappato per macro-area (minori=rosso, migrazione=blu, dipendenze=viola, formazione=giallo, sociale=teal)
- Date in formato italiano: `15 mar 2025`, con label "tra Xgg"
- Responsive: sidebar collassabile su mobile

### Gestione Errori
- Ogni chiamata API wrappata in try/catch
- Stato loading con spinner per ogni sezione indipendente
- Stato errore con messaggio user-friendly e retry button
- Fallback graceful: se un'API fallisce, il resto della dashboard funziona

### Sicurezza
- Nessuna credenziale hardcoded nel frontend
- OAuth2 token gestito solo server-side nelle API routes
- Environment variables per tutti i segreti
- Dati sensibili (minori, migranti): mai cached nel browser, sempre fresh dal server

## Comandi Utili

### Sviluppo
```bash
npm run dev           # Avvia Next.js in dev mode (porta 3000)
npm run build         # Build produzione
npm run lint          # ESLint + type checking
npm run type-check    # Solo TypeScript check
```

### Docker
```bash
# Build e avvia il frontend
docker compose up --build -d

# Log del frontend
docker compose logs -f frontend

# Verifica stato Nextcloud
docker exec parsec-nextcloud php occ status --output=json

# Test API da dentro il container NC
docker exec parsec-nextcloud curl -s -u admin:Parsec@2026 \
  "http://localhost/ocs/v1.php/cloud/user" \
  -H "OCS-APIRequest: true" -H "Accept: application/json"
```

### Test API Rapido (da terminale host)
```bash
# User info
curl -s -u admin:Parsec@2026 "http://localhost:8080/ocs/v1.php/cloud/user" \
  -H "OCS-APIRequest: true" -H "Accept: application/json" | jq '.ocs.data.id'

# Lista cartelle Progettazione
curl -s -u admin:Parsec@2026 -X PROPFIND -H "Depth: 1" \
  "http://localhost:8080/remote.php/dav/files/admin/Progettazione/"

# Activity recenti
curl -s -u admin:Parsec@2026 "http://localhost:8080/ocs/v2.php/apps/activity/api/v2/activity/all?limit=5" \
  -H "OCS-APIRequest: true" -H "Accept: application/json" | jq '.ocs.data[].subject'
```

## Riferimento Mockup
Nella cartella `docs/` ci sono i mockup di riferimento (`parsec_new.pdf`):
- **Pagina 3**: Dashboard Progettista — sidebar con aree, stat cards, file recenti con tag
- **Pagina 4**: Pagina Progetto — scheda completa con metadati, partenariato, documenti per categoria, valutazione

## Note Importanti
- Nextcloud è il "source of truth" per file e permessi. Il frontend non gestisce permessi autonomamente.
- Le cartelle progetto seguono la struttura: `Progetti Attivi/{NomeProgetto}/Report|Produzioni|Lavoro`
- I bandi senza data di scadenza hanno campo vuoto o nota "a sportello" / "senza scadenza"
- L'organizzazione ha ~90 utenti ma in fase iniziale solo 5-8 testeranno il portale
- Hosting produzione: VPS EU (Hetzner) per compliance GDPR (dati sensibili su minori/migranti)
