/**
 * SERVIDOR LOCAL ULTRALIVIANO PARA EL STAND
 * No requiere 'npm install' - Usa los módulos nativos de Node.js.
 * Permite que tablets y celulares en la misma red Wi-Fi o Hotspot accedan a la app.
 *
 * API compartida (sincroniza participantes -> panel admin entre dispositivos):
 *   GET    /api/records       -> lista de registros
 *   POST   /api/records       -> guarda un registro (idempotente por id)
 *   DELETE /api/records       -> borra todos los registros
 *   DELETE /api/records/:id   -> borra un registro
 *   GET    /api/stream        -> Server-Sent Events con cambios en tiempo real
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'records.json');
const MAX_BODY_BYTES = 256 * 1024;
const MAX_RECORDS = 5000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

/* ---------------------------- Persistencia ---------------------------- */
let records = loadRecords();
const sseClients = new Set();

function loadRecords() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn('No se pudo leer data/records.json, se inicia vacío:', err.message);
    }
    return [];
  }
}

function persistRecords() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = DATA_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(records));
    fs.renameSync(tmp, DATA_FILE);
  } catch (err) {
    console.error('Error al persistir registros:', err.message);
  }
}

function broadcast(event) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}

/* ----------------------------- Validación ----------------------------- */
function sanitizeRecord(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const id = typeof raw.id === 'string' ? raw.id.slice(0, 64) : '';
  const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 80) : '';
  const timeMs = Number(raw.timeMs);
  if (!id || !name || !Number.isFinite(timeMs) || timeMs <= 0 || timeMs > 600000) return null;

  const bestTimeMs = Number.isFinite(Number(raw.bestTimeMs)) ? Number(raw.bestTimeMs) : timeMs;
  const attempts = Array.isArray(raw.attempts)
    ? raw.attempts.slice(0, 20).map(Number).filter(Number.isFinite)
    : [];

  return {
    id,
    name,
    email: typeof raw.email === 'string' ? raw.email.trim().toLowerCase().slice(0, 120) : '',
    level: typeof raw.level === 'string' ? raw.level.slice(0, 60) : 'Reacción a Colores',
    timeMs: Math.round(timeMs),
    timeSeconds: Number((timeMs / 1000).toFixed(3)),
    bestTimeMs: Math.round(bestTimeMs),
    bestTimeSeconds: Number((bestTimeMs / 1000).toFixed(3)),
    attempts,
    rating: raw.rating && typeof raw.rating === 'object' ? {
      tier: String(raw.rating.tier || '').slice(0, 60),
      classBadge: String(raw.rating.classBadge || '').slice(0, 30),
      icon: String(raw.rating.icon || '').slice(0, 8)
    } : undefined,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    timestamp: Number.isFinite(Number(raw.timestamp)) ? Number(raw.timestamp) : Date.now()
  };
}

/* ------------------------------- Helpers ------------------------------- */
function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(new Error('INVALID_JSON'));
      }
    });
    req.on('error', reject);
  });
}

/* ------------------------------- API REST ------------------------------- */
async function handleApi(req, res, pathname) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (pathname === '/api/stream' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('retry: 2000\n\n');
    sseClients.add(res);
    const keepAlive = setInterval(() => res.write(': ping\n\n'), 25000);
    req.on('close', () => {
      clearInterval(keepAlive);
      sseClients.delete(res);
    });
    return;
  }

  if (pathname === '/api/records') {
    if (req.method === 'GET') {
      sendJson(res, 200, records);
      return;
    }

    if (req.method === 'POST') {
      try {
        const record = sanitizeRecord(await readJsonBody(req));
        if (!record) {
          sendJson(res, 400, { error: 'Registro inválido' });
          return;
        }
        const isNew = !records.some((r) => r.id === record.id);
        if (isNew) {
          records.unshift(record);
          if (records.length > MAX_RECORDS) records.length = MAX_RECORDS;
          persistRecords();
          broadcast({ type: 'NEW_RECORD', record });
        }
        sendJson(res, isNew ? 201 : 200, { ok: true, isNew });
      } catch (err) {
        const status = err.message === 'PAYLOAD_TOO_LARGE' ? 413 : 400;
        sendJson(res, status, { error: 'Solicitud inválida' });
      }
      return;
    }

    if (req.method === 'DELETE') {
      records = [];
      persistRecords();
      broadcast({ type: 'CLEARED_ALL' });
      sendJson(res, 200, { ok: true });
      return;
    }
  }

  const match = pathname.match(/^\/api\/records\/([^/]+)$/);
  if (match && req.method === 'DELETE') {
    const id = decodeURIComponent(match[1]);
    records = records.filter((r) => r.id !== id);
    persistRecords();
    broadcast({ type: 'DELETED_ONE', deletedId: id });
    sendJson(res, 200, { ok: true });
    return;
  }

  sendJson(res, 404, { error: 'Ruta no encontrada' });
}

/* ---------------------------- Archivos estáticos ---------------------------- */
const server = http.createServer((req, res) => {
  let reqPath;
  try {
    reqPath = decodeURI(req.url.split('?')[0]);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Solicitud inválida');
    return;
  }

  if (reqPath.startsWith('/api/')) {
    handleApi(req, res, reqPath).catch((err) => {
      console.error('Error en API:', err);
      if (!res.headersSent) sendJson(res, 500, { error: 'Error interno' });
    });
    return;
  }

  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(path.join(PUBLIC_DIR, reqPath));

  // Bloquea path traversal y el acceso directo a la base de datos local
  if (!safePath.startsWith(PUBLIC_DIR) || safePath.startsWith(DATA_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Acceso denegado');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Archivo no encontrado');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('===========================================================');
  console.log('🏁 SERVIDOR LOCAL DEL STAND ACTIVO (CFP 412 - MANEJO SEGURO)');
  console.log('===========================================================');
  console.log(`Local (en esta máquina): http://localhost:${PORT}`);
  console.log(`Registros cargados: ${records.length} (data/records.json)`);

  // Obtener IPs locales de la red Wi-Fi para tablets/celulares
  const interfaces = os.networkInterfaces();
  console.log('\n📱 Para conectar celulares/tablets en el Stand:');
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`  ➔ Red Wi-Fi (${name}): http://${iface.address}:${PORT}`);
        console.log(`  ➔ Panel Admin TV: http://${iface.address}:${PORT}/admin.html`);
      }
    }
  }
  console.log('\n💡 Presioná Ctrl + C para detener el servidor.');
  console.log('===========================================================');
});
