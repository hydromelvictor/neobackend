import { Socket } from "socket.io";
import device from "./device.websocket";
import permission from "./permissions.websockets";
import { JsonResponse } from "../types/api";
import Notify from "../models/stats/notify.models";



const notify = (socket: Socket, io: any) => {
    socket.on('NotifyCreate', async (data) => {
        io.use(device('CREATE NOTIFY'));
        io.use(permission('CREATE-NOTIFY'));

        try {
            const notify = await Notify.create(data);
            const response: JsonResponse = {
                success: true,
                message: 'create notify',
                data: notify
            }
            io.to(socket.id).emit('NotifyCreate', response);
        } catch (err: any) {
            console.log(err.message)
            const response: JsonResponse = {
                success: true,
                message: 'create failed',
                error: err.message
            }
            io.to(socket.id).emit('NotifyCreate', response);
        }
    })

    socket.on('NotifyUpdate', async (data) => {
        io.use(device('UPDATE NOTIFY'));
        io.use(permission('UPDATE-NOTIFY'));

        try {
            const notify = await Notify.findById(data.id);
            if (!notify) throw new Error('notify not found');

            Object.assign(notify, data);
            await notify.save();
            const response: JsonResponse = {
                success: true,
                message: 'update notify',
                data: notify
            }
            io.to(socket.id).emit('NotifyUpdate', response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: true,
                message: 'update failed',
                error: err.message
            }
            io.to(socket.id).emit('NotifyUpdate', response);
        }
    })

    socket.on('NotifyDelete', async (data) => {
        io.use(device('DELETE NOTIFY'));
        io.use(permission('DELETE-NOTIFY'));

        try {
            const notify = await Notify.findById(data.id);
            if (!notify) throw new Error('notify not found');

            await notify.deleteOne();
            const response: JsonResponse = {
                success: true,
                message: 'delete notify'
            }
            io.to(socket.id).emit('NotifyDelete', response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: true,
                message: 'delete failed',
                error: err.message
            }
            io.to(socket.id).emit('NotifyDelete', response);
        }
    })

    socket.on('NotifyList', async (data) => {
        io.use(device('LIST NOTIFY'));
        io.use(permission('LIST-NOTIFY'));

        try {
            const options = {
                page: parseInt(data.page),
                limit: parseInt(data.limit),
                sort: { createdAt: -1 }
            }

            const filter: any = {};
            if (data.state) filter.state = data.state;
            const notify = await Notify.paginate(filter, options);
            const response: JsonResponse = {
                success: true,
                message: 'list notify',
                data: notify
            }
            io.to(socket.id).emit('NotifyList', response);
        } catch(err: any) {
            const response: JsonResponse = {
                success: true,
                message: 'list failed',
                error: err.message
            }
            io.to(socket.id).emit('NotifyList', response);
        }
    })

    socket.on('NotifyRead', async (data) => {
        io.use(device('READ NOTIFY'));
        io.use(permission('READ-NOTIFY'));

        try {
            const notify = await Notify.findById(data.id);
            if (!notify) throw new Error('notify not found');

            notify.view.size++;
            await notify.save();
            const response: JsonResponse = {
                success: true,
                message: 'read notify',
                data: notify
            }
            io.to(socket.id).emit('NotifyRead', response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: true,
                message: 'read failed',
                error: err.message
            }
            io.to(socket.id).emit('NotifyRead', response);
        }
    })
}

export default notify;

    