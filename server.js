const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8083;
const DIR = 'D:\\Downloads\\New folder (9)\\extracted\\bootstrap-big-ecommerce';

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let file = path.join(DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(file)) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
    return;
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, {'Content-Type': MIME[ext] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('bootstrap-big-ecommerce running at http://localhost:' + PORT);
});
