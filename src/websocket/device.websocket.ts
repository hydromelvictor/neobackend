import { JsonResponse } from "../types/api";
import Device from "../models/stats/device.models";


const device = (actionType: string) => {
    return async (socket: any, next: any) => {
        try {
            const device = new Device({
                hote: socket.data.user._id,
                path: socket.handshake.url,
                type: actionType,
                method: socket.handshake.method,
                ip: socket.handshake.address,
                agent: socket.handshake.headers['user-agent'],
                browser: socket.handshake.headers['browser'],
                os: socket.handshake.headers['os'],
                location: socket.handshake.headers['location']
            });
            await device.save();
            next();
        } catch (error) {
            const response: JsonResponse = {
                success: false,
                message: 'Token invalide',
                error: 'Invalid token'
            }
            socket.emit('unauthorized', response);
        }
    }
}

export default device;
