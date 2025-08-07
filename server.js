// server.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createServer } = require('http');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { WebSocketServer } = require('ws');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('⚡ Client connected');

    ws.on('message', (message) => {
      console.log('📩 Received:', message);
      ws.send(`📡 Server received: ${message}`);
    });

    ws.on('close', () => {
      console.log('❌ Client disconnected');
    });
  });

  const PORT = process.env.PORT || 3005;
  server.listen(PORT, () => {
    console.log(`✅ Ready on http://localhost:${PORT}`);
  });
});
