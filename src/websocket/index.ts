import { Socket } from "socket.io";
import { verifyToken } from "../helpers/token.helpers";
import { JsonResponse } from "../types/api";
import rooms from './rooms.websocket';
import mongoose from "mongoose";



const socketAuth = async (socket: any, next: any) => {
    try {
        const authHeader = socket.handshake.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) return next(new Error('unauthorized'));

        const token = authHeader.split(' ')[1];
        if (!token) return next(new Error('unauthorized'));

        const result = verifyToken(token);
        const decoded: any = result.data;
        const Instance = mongoose.model(decoded.model);
            
        const user = await Instance.findById(decoded.id);
        if (!user || !user.isAuthenticated || !user.online) throw new Error('unauthorized');
    
        socket.data.user = user;
        next();
    } catch (err: any) {
        const response: JsonResponse = {
            success: false,
            message: 'unauthorized',
            error: err.message
        }
        socket.emit('unauthorized', response);
    }
}


const handler = (io: any) => {
    io.use(socketAuth);

    io.on('connection', (socket: Socket) => {
        console.log('a user connected');

        rooms(socket, io);

        socket.on('disconnect', () => {
            console.log('user disconnected');
        })
    })
}

export default handler;
