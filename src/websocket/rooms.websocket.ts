import mongoose from "mongoose"
import { Socket } from "socket.io"
import Room from "../models/network/discussion.models"
import Guest from "../models/network/guest.models"
import Sms from "../models/network/message.models"
import Attach from "../models/network/attachment.models"
import Reaction from "../models/network/reaction.models"
import Org from "../models/associate/org.models"

const rooms = (socket: Socket, io: any) => {
    socket.on('findOrCreateRoom', async (params) => {
        try {
            const room = await Room.findById(params.id);
            let data: any = {};
            if (room) {
                data.room = room._id;
                data.name = room?.name;
                
                const guests = await Guest.find({ room: room._id });
                for (const guest of guests) {
                    const Instance = await mongoose.model(guest.role.charAt(0).toUpperCase() + guest.role.slice(1)).findById(guest.hote);
                    if (!Instance) throw new Error('hote not found');
                    
                    const hote = Instance.findById(guest.hote);
                    if (!hote) throw new Error('hote not found');
                    
                    data.guests.push({ ...hote, guestId: guest.hote });
                }

                const sms = await Sms.find({ room: room._id }).sort({ createdAt: -1 }).limit(5);
                for (const message of sms) {
                    const attachs = await Attach.find({ message: message._id });
                    const reactions = await Reaction.find({ message: message._id });
                    
                    const messages = { ...message, attachments: attachs, reactions };
                    data.messages.push(messages);
                }
            } else {
                const room = await Room.create({ status: 'private' });
                data.room = room._id;
                data.name = room?.name;

                const guest = await Guest.create({ room: room._id, hote: socket.data.user._id, role: 'lead' });
                data.guests.push({ ...socket.data.user, guestId: guest.hote });

                const org = await Org.findById(params.org);
                if (!org) throw new Error('locator not found');

                data.guests.push({ ...org, guestId: org._id });

                // ajouter les guests au rooms
                socket.join(data.room.toString());
            }
            io.to(data.room).emit('findOrCreateRoom', data);
        } catch (err: any) {
            console.log(err.message)
        }
    })

    socket.on('findAllRooms', async (data) => {
        try {
            const options = {
                page: parseInt(data.page),
                limit: parseInt(data.limit),
                sort: { createdAt: -1 }
            }
            const rooms = await Room.paginate({}, options);
            const count = await Room.countDocuments();
            io.to(socket.id).emit('findAllRooms', { rooms, count });
        } catch (err: any) {
            console.log(err.message)
        }
    })

    socket.on('joinRoom', async (data) => {
        try {
            const room = await Room.findById(data.room);
            if (!room) throw new Error('room not found');

            socket.join(data.room);
            io.to(socket.id).emit('joinRoom', room);
        } catch (err: any) {
            console.log(err.message)
        }
    })

    socket.on('leaveRoom', async (data) => {
        try {
            const room = await Room.findById(data.room);
            if (!room) throw new Error('room not found');

            socket.leave(data.room);
            
            await Attach.deleteMany({ message: { $in: await Sms.find({ room: data.room }) } });
            await Reaction.deleteMany({ message: { $in: await Sms.find({ room: data.room }) } });
            await Sms.deleteMany({ room: data.room });
            await Guest.deleteMany({ room: data.room });
            await Room.deleteOne({ _id: data.room });

            io.to(socket.id).emit('leaveRoom', room);
        } catch (err: any) {
            console.log(err.message)
        }
    })

    socket.on('myAllRooms', async () => {
        try {
            const rooms = await Guest.find({ hote: { $in: [socket.data.user._id, socket.data.user.org || ''] } });
            io.to(socket.id).emit('myAllRooms', rooms);
        } catch (err: any) {
            console.log(err.message)
        }
    })

    socket.on('sendSms', async (data) => {
        try {
            const sms = await Sms.create({ room: data.room, hote: socket.data.user._id, content: data.content, state: data.state });
            
            let hote = await Guest.findById(socket.data.user._id);
            if (!hote) throw new Error('hote not found');

            hote = await mongoose.model(hote.role.charAt(0).toUpperCase() + hote.role.slice(1)).findById(hote.hote);
            if (!hote) throw new Error('hote not found');

            let result: any = { ...sms, hote, attachments: [], reactions: [] };

            if (sms.state !== 'external' && !sms.content) return;
            else {
                if (data.attachments.length <= 0) return;
                result.attachments = await Attach.insertMany(data.attachments);
            }

            io.to(data.room).emit('sendSms', result);
        } catch (err: any) {
            console.log(err.message)
        }
    })

    socket.on('readSms', async (data) => {
        try {
            const sms = await Sms.findById(data.id);
            if (!sms) throw new Error('sms not found');

            sms.read = true;
            await sms.save();
            io.to(data.room).emit('readSms', sms);
        } catch (err: any) {
            console.log(err.message)
        }
    })

    socket.on('listSms', async (data) => {
        try {
            const options = {
                page: parseInt(data.page),
                limit: parseInt(data.limit),
                sort: { createdAt: -1 }
            }
            const sms = await Sms.paginate({ room: data.room }, options);
            const count = await Sms.countDocuments({ room: data.room });
            io.to(socket.id).emit('listSms', { sms, count });
        } catch (err: any) {
            console.log(err.message)
        }
    })

    
}

export default rooms;
