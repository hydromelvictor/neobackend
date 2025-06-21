// modules natifs et packages
import * as dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

// modules perso
import app from './app';
import handler from './socket';
import init, { serverEvents } from './deamon';

// Fonction pour normaliser le port
const normalizePort = (val: string): number | string | false => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(process.env.PORT || '3000');

if (typeof port === 'boolean') {
  throw new Error('Invalid port configuration');
}

app.set('port', port);

// Créer le serveur HTTP
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*'
  }
});

// Initialisation des sockets
handler(io);

// Gestion des erreurs
const errorHandler = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Démarrage du serveur avec événement
serverEvents.on('start', async () => {
  await init();
  console.log('Daemon started');
});

server.listen(port, () => {
  console.log(`Start Server on port ${port}`);
  console.log(`Documentation: http://localhost:${port}/docs`);
  serverEvents.emit('start');
});
