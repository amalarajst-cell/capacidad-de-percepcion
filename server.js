/**
 * SERVIDOR LOCAL ULTRALIVIANO PARA EL STAND
 * No requiere 'npm install' - Usa los módulos nativos de Node.js.
 * Permite que tablets y celulares en la misma red Wi-Fi o Hotspot accedan a la app.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

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

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(path.join(PUBLIC_DIR, reqPath));

  if (!safePath.startsWith(PUBLIC_DIR)) {
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
  console.log('🏁 SERVIDOR LOCAL DEL STAND ACTIVO (CFL 412 - F1 REACCIÓN)');
  console.log('===========================================================');
  console.log(`Local (en esta máquina): http://localhost:${PORT}`);

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
