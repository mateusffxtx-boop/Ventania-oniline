// ============================================================
//  VENTANIA · Servidor de sinalização dedicado (PeerJS)
//  Roda em qualquer Node.js 20+.
//  Função: substituir o servidor público 0.peerjs.com.
//  Todo o tráfego do jogo continua P2P (WebRTC) entre os jogadores.
// ============================================================
'use strict';

const { PeerServer } = require('peer');

const PORT = Number(process.env.PORT) || 9000;
const PATH = process.env.PEER_PATH || '/';

const server = PeerServer({
  port: PORT,
  path: PATH,
  allow_discovery: false, // ninguém enxerga outros peers
  proxied: true,          // funciona atrás de reverse proxy (Railway/Render/Fly)
  key: 'peerjs',
  debug: process.env.DEBUG === '1',
});

const PUBLIC = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
console.log(`[ventania-peer] listening on :${PORT} path=${PATH}`);
console.log(`[ventania-peer] configure o jogo com: ?peer=${PUBLIC}`);
console.log(`[ventania-peer] ou no console: ventaniaPeer.set('${PUBLIC}')`);

// Health-check básico (para Render/Railway/Fly)
server.app?.get('/healthz', (_req, res) => res.send('ok'));

const shutdown = () => {
  console.log('[ventania-peer] encerrando…');
  try { server.close?.(); } catch (e) {}
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);