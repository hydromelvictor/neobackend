import { Socket } from "socket.io";
import Status from "../models/associate/status.models";
import View from "../models/associate/view.models";
import { JsonResponse } from "../types/api";
import { device } from "../middleware";
import permission from "./permissions.websockets";


const status = (socket: Socket, io: any) => {
    socket.on('createStatus', async (data) => {
        io.use(device('CREATE STATUS'));
        io.use(permission('CREATE-STATUS'));

        try {
            let status = await Status.findById(data.id);
            if (!status) {
                status = await Status.create(data);
            } else {
                Object.assign(status, data);
                await status.save();
            }

            const response: JsonResponse = {
                success: true,
                message: 'create status',
                data: status
            }
            io.emit('createStatus', response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'create failed',
                error: err.message
            }
            io.to(socket.id).emit('createStatus', response);
        }
    })

    socket.on('retrieveStatus', async (data) => {
        io.use(device('RETRIEVE STATUS'));
        io.use(permission('RETRIEVE-STATUS'));


        try {
            const status = await Status.findById(data.id);
            if (!status) throw new Error('not found');

            let view = await View.findOne({ status: data.id, viewer: socket.data.user._id });
            if (!view)
                view = await View.create({ status: data.id, viewer: socket.data.user._id });

            const views = await View.find({ status: data.id });
            const count = await View.countDocuments({ status: data.id });

            const response: JsonResponse = {
                success: true,
                message: 'retrieve status',
                data: { ...status, views, count }
            }
            io.to(socket.id).emit('retrieveStatus', response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'create failed',
                error: err.message
            }
            io.to(socket.id).emit('retrieveStatus', response);
        }
    })

    socket.on('listStatus', async (data) => {
        io.use(device('LIST STATUS'));
        io.use(permission('LIST-STATUS'));


        try {
            const filter: any = {};
            if (data.org) filter['org'] = data.org;

            const options: any = {
                page: data.page || 1,
                limit: data.limit || 10,
                sort: { createdAt: -1 }
            }
            const status = await Status.paginate(filter, options);
            const response: JsonResponse = {
                success: true,
                message: 'list status',
                data: status
            }
            io.to(socket.id).emit('listStatus', response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'create failed',
                error: err.message
            }
            io.to(socket.id).emit('listStatus', response);
        }
    })

    socket.on('deleteStatus', async (data) => {
        io.use(device('DELETE STATUS'));
        io.use(permission('DELETE-STATUS'));


        try {
            const status = await Status.findById(data.id);
            if (!status) throw new Error('not found');

            await status.deleteOne();
            const response: JsonResponse = {
                success: true,
                message: 'delete status',
                data: status
            }
            io.emit('deleteStatus', response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'create failed',
                error: err.message
            }
            io.to(socket.id).emit('deleteStatus', response);
        }
    })

    socket.on('countStatus', async (data) => {
        io.use(device('COUNT STATUS'));
        io.use(permission('COUNT-STATUS'));


        try {
            const filter: any = {};
            if (data.org) filter['org'] = data.org;

            const count = await Status.countDocuments(filter);
            const response: JsonResponse = {
                success: true,
                message: 'count status',
                data: count
            }
            io.to(socket.id).emit('countStatus', response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'create failed',
                error: err.message
            }
            io.to(socket.id).emit('countStatus', response);
        }
    })
    
}

export default status;
