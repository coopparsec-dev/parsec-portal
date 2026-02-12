// Client WebDAV per navigazione cartelle Nextcloud
import type { FileItem } from './types';

/**
 * Lista file e cartelle in un path
 * @param path - Percorso relativo (es: 'Progettazione' o 'Progetti Attivi')
 * @param user - Username Nextcloud (default: 'admin' per testing)
 */
export async function listFolder(
  path: string,
  user: string = 'admin'
): Promise<FileItem[]> {
  try {
    // Costruisci il path WebDAV
    const webdavPath = `/remote.php/dav/files/${user}/${path}`;
    
    console.log(`📂 Listing folder: ${webdavPath}`);

      // Chiamata PROPFIND tramite proxy (usando POST con header X-Method)
    const response = await fetch(`/api/nc${webdavPath}`, {
      method: 'POST',
      headers: {
        'X-Method': 'PROPFIND',
        'Depth': '1',
        'Content-Type': 'application/xml',
      },
      body: `<?xml version="1.0"?>
        <d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
          <d:prop>
            <d:getlastmodified />
            <d:getcontentlength />
            <d:getcontenttype />
            <d:resourcetype />
            <oc:fileid />
          </d:prop>
        </d:propfind>`,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    console.log('📦 WebDAV response received');

    // Parse XML e converti in array FileItem
    return parseWebDAVResponse(xmlText, user, path);
    
  } catch (error) {
    console.error('WebDAV error:', error);
    throw error;
  }
}

/**
 * Parser per risposta XML WebDAV
 */
function parseWebDAVResponse(xmlText: string, user: string, basePath: string): FileItem[] {
  console.log('📦 Raw XML:', xmlText.substring(0, 2000)); // ← AGGIUNGI QUESTA RIGA (primi 2000 caratteri)
  
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  const responses = xmlDoc.getElementsByTagName('d:response');
  const items: FileItem[] = [];

  // Salta il primo elemento (è la cartella stessa)
  for (let i = 1; i < responses.length; i++) {
    const response = responses[i];
    
    // Estrai href (path del file)
    const hrefEl = response.getElementsByTagName('d:href')[0];
    const href = hrefEl?.textContent || '';
    
    // Estrai proprietà
    const propstat = response.getElementsByTagName('d:propstat')[0];
    const prop = propstat?.getElementsByTagName('d:prop')[0];
    
    if (!prop) continue;

    // Nome file (ultimo segmento del path)
    const name = decodeURIComponent(href.split('/').filter(Boolean).pop() || '');
    
    // Tipo (file o directory)
    const resourceType = prop.getElementsByTagName('d:resourcetype')[0];
    const isDirectory = resourceType?.getElementsByTagName('d:collection').length > 0;
    
    // Dimensione
    const sizeEl = prop.getElementsByTagName('d:getcontentlength')[0];
    const size = parseInt(sizeEl?.textContent || '0', 10);
    
    // Data modifica
    const mtimeEl = prop.getElementsByTagName('d:getlastmodified')[0];
    const mtime = mtimeEl?.textContent || '';
    
    // MIME type
   // MIME type
    const mimetypeEl = prop.getElementsByTagName('d:getcontenttype')[0];
    const mimetype = mimetypeEl?.textContent || undefined;

    // File ID (Nextcloud numeric ID)
    const fileIdEl = prop.getElementsByTagName('oc:fileid')[0];
    const fileId = fileIdEl?.textContent || undefined;
    console.log(`📄 ${name} - fileId:`, fileId);  // ← AGGIUNGI QUESTO

    items.push({
      id: href,
      fileId,  // ← AGGIUNGI QUESTO
      name,
      path: href,
      type: isDirectory ? 'directory' : 'file',
      size,
      mtime,
      mimetype,
    });
  }

  return items;
}