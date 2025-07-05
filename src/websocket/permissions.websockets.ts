import { JsonResponse } from "../types/api";

const permission = (permission: string) => {
    return async (socket: any, next: any) => {
        try {
            if (!socket.data.user) throw new Error('unauthorized');
            if (!socket.data.user.permissions.includes(permission)) throw new Error('unauthorized');
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
}

export default permission;
