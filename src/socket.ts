import { Server, Socket } from 'socket.io';

// import messageSocket from './websockets/messageSocket';
// import chatSocket from './websockets/chatSocket';
// import notificationSocket from './websockets/notificationSocket';

const handler = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log('Utilisateur connecté :', socket.id);

    // Initialiser les WebSockets pour chaque module
    // messageSocket(socket, io);
    // chatSocket(socket, io);
    // notificationSocket(socket, io);

    socket.on('disconnect', () => {
      console.log('Utilisateur déconnecté :', socket.id);
    });
  });
};

export default handler;
