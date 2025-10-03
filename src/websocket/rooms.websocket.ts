// import mongoose from "mongoose"
import { Socket } from "socket.io"
// import Room from "../models/network/discussion.models"
import Sms from "../models/network/message.models"
import Attach from "../models/network/attachment.models"
import Reaction from "../models/network/reaction.models"
// import Org from "../models/associate/org.models"
import { JsonResponse } from "../types/api"
import device from "./device.websocket"
// import permission from "./permissions.websockets"
// import Neo from "../models/users/neo.models"
// import builder from "../ai/commercial"



const rooms = (socket: Socket, io: any) => {
    // socket.on('findOrCreateRoom', async (params) => {
    //     io.use(device('INIT CHAT'));
    //     io.use(permission('INIT-CHAT'));

    //     try {
    //         const room = await Room.findById(params.id);
    //         let data: any = {};
    //         if (room) {
    //             data.room = room._id;
    //             data.name = room?.name;
                
    //             const guests = await Guest.find({ room: room._id });
    //             for (const guest of guests) {
    //                 const Instance = await mongoose.model(guest.role.charAt(0).toUpperCase() + guest.role.slice(1)).findById(guest.hote);
    //                 if (!Instance) throw new Error('hote not found');
                    
    //                 const hote = Instance.findById(guest.hote);
    //                 if (!hote) throw new Error('hote not found');
                    
    //                 data.guests.push({ ...hote, guestId: guest.hote });
    //             }

    //             const sms = await Sms.find({ room: room._id }).sort({ createdAt: -1 }).limit(5);
    //             for (const message of sms) {
    //                 const attachs = await Attach.find({ message: message._id });
    //                 const reactions = await Reaction.find({ message: message._id });
                    
    //                 const messages = { ...message, attachments: attachs, reactions };
    //                 data.messages.push(messages);
    //             }
    //         } else {
    //             const room = await Room.create({ status: 'private' });
    //             data.room = room._id;
    //             data.name = room?.name;

    //             const guest = await Guest.create({ room: room._id, hote: socket.data.user._id, role: 'lead' });
    //             data.guests.push({ ...socket.data.user, guestId: guest.hote });

    //             const org = await Org.findById(params.org);
    //             if (!org) throw new Error('locator not found');

    //             data.guests.push({ ...org, guestId: org._id });

    //             // ajouter les guests au rooms
    //             socket.join(data.room.toString());
    //         }

    //         const response: JsonResponse = {
    //             success: true,
    //             message: 'read in the room',
    //             data: data
    //         }
    //         io.to(data.room).emit('findOrCreateRoom', response);
    //     } catch (err: any) {
    //         console.log(err.message)
    //         const response: JsonResponse = {
    //             success: true,
    //             message: 'read failed',
    //             error: err.message
    //         }
    //         io.to(socket.id).emit('findOrCreateRoom', response);
    //     }
    // })

    // socket.on('findAllRooms', async (data) => {
    //     io.use(device('LIST CHAT'));
    //     io.use(permission('LIST-CHAT'));

    //     try {
    //         const options = {
    //             page: parseInt(data.page),
    //             limit: parseInt(data.limit),
    //             sort: { createdAt: -1 }
    //         }
    //         const rooms = await Room.paginate({}, options);
    //         const count = await Room.countDocuments();

    //         const response: JsonResponse = {
    //             success: true,
    //             message: 'list rooms',
    //             data: { rooms, count }
    //         }
    //         io.to(socket.id).emit('findAllRooms', response);
    //     } catch (err: any) {
    //         console.log(err.message)
    //         const response: JsonResponse = {
    //             success: true,
    //             message: 'list failed',
    //             error: err.message
    //         }
    //         io.to(socket.id).emit('findAllRooms', response);
    //     }
    // })

    // socket.on('joinRoom', async (data) => {
    //     io.use(device('JOIN ROOM CHAT'));
    //     io.use(device('JOIN-CHAT'));

    //     try {
    //         const room = await Room.findById(data.room);
    //         if (!room) throw new Error('room not found');

    //         socket.join(data.room);

    //         const response: JsonResponse = {
    //             success: true,
    //             message: 'join in the room',
    //             data: room
    //         }
    //         io.to(socket.id).emit('joinRoom', response);
    //     } catch (err: any) {
    //         console.log(err.message)
    //         const response: JsonResponse = {
    //             success: true,
    //             message: 'join failed',
    //             error: err.message
    //         }
    //         io.to(socket.id).emit('joinRoom', response);
    //     }
    // })

    // socket.on('leaveRoom', async (data) => {
    //     io.use(device('LEAVE ROOM CHAT'));
    //     io.use(device('LEAVE-CHAT'));

    //     try {
    //         const room = await Room.findById(data.room);
    //         if (!room) throw new Error('room not found');

    //         socket.leave(data.room);
            
    //         await Attach.deleteMany({ message: { $in: await Sms.find({ room: data.room }) } });
    //         await Reaction.deleteMany({ message: { $in: await Sms.find({ room: data.room }) } });
    //         await Sms.deleteMany({ room: data.room });
    //         await Guest.deleteMany({ room: data.room });
    //         await Room.deleteOne({ _id: data.room });

    //         const response: JsonResponse = {
    //             success: true,
    //             message: 'leave room',
    //             data: room
    //         }
    //         io.to(socket.id).emit('leaveRoom', response);
    //     } catch (err: any) {
    //         console.log(err.message)
    //         const response: JsonResponse = {
    //             success: true,
    //             message: 'leave failed',
    //             error: err.message
    //         }
    //         io.to(socket.id).emit('leaveRoom', response);
    //     }
    // })

    // socket.on('myAllRooms', async () => {
    //     io.use(device('PERSONAL LIST CHAT'));
    //     io.use(device('PERSONAL-CHAT'));

    //     try {
    //         const rooms = await Guest.find({ hote: { $in: [socket.data.user._id, socket.data.user.org || ''] } });

    //         const response: JsonResponse = {
    //             success: true,
    //             message: 'list my all rooms',
    //             data: rooms
    //         }
    //         io.to(socket.id).emit('myAllRooms', response);
    //     } catch (err: any) {
    //         console.log(err.message)
    //         const response: JsonResponse = {
    //             success: true,
    //             message: 'list failed',
    //             error: err.message
    //         }
    //         io.to(socket.id).emit('myAllRooms', response);
    //     }
    // })

    // socket.on('sendSms', async (data) => {
    //     io.use(device('SEND CHAT'));
    //     io.use(device('SEND-CHAT'));

    //     try {
    //         const sms = await Sms.create({ room: data.room, hote: socket.data.user._id, content: data.content, state: data.state });
            
    //         let hote = await Guest.findById(socket.data.user._id);
    //         if (!hote) throw new Error('hote not found');

    //         hote = await mongoose.model(hote.role.charAt(0).toUpperCase() + hote.role.slice(1)).findById(hote.hote);
    //         if (!hote) throw new Error('hote not found');

    //         let result: any = { ...sms, hote, attachments: [], reactions: [] };

    //         if (sms.state !== 'external' && !sms.content) return;
    //         else {
    //             result.attachments = (await Attach.find({ message: sms._id })).map(attach => attach._id);
    //         }

    //         const response: JsonResponse = {
    //             success: true,
    //             message: 'send sms in the room',
    //             data: result
    //         }

    //         io.to(data.room).emit('sendSms', response);

    //         // organisons la reponse immediate si elle doit venir de l'IA
    //         if (hote.role !== 'org' && data.ia) {
    //             const neo = await Neo.findById(data.ia);
    //             if (!neo) throw new Error('neo not found');
    //             if (!neo.online) return;

    //             const response = await builder(neo._id, result, data.room);
    //             if (response.error) return;
    //             const message = await Sms.create({ room: data.room, hote: neo._id, content: response.content, state: 'external' });
    //             const attachs = (await Attach.find({ message: message._id })).map(attach => attach._id);
    //             const reactions = (await Reaction.find({ message: message._id })).map(reaction => reaction._id);

    //             io.to(data.room).emit('sendSms', {
    //                 success: true,
    //                 message: 'send sms in the room',
    //                 data: { ...message, attachments: attachs, reactions }
    //             });
    //         }
    //     } catch (err: any) {
    //         console.log(err.message)
    //         const response: JsonResponse = {
    //             success: true,
    //             message: 'send sms failed',
    //             error: err.message
    //         }
    //         io.to(socket.id).emit('sendSms', response);
    //     }
    // })

    socket.on('readSms', async (data) => {
        io.use(device('READ CHAT'));
        io.use(device('READ-CHAT'));

        try {
            const sms = await Sms.findById(data.id);
            if (!sms) throw new Error('sms not found');

            sms.read = true;
            await sms.save();

            const attachments = await Attach.find({ message: sms._id });
            const reactions = await Reaction.find({ message: sms._id });

            const response: JsonResponse = {
                success: true,
                message: 'read sms in the room',
                data: { ...sms, attachments, reactions }
            }
            io.to(data.room).emit('readSms', response);
        } catch (err: any) {
            console.log(err.message)
            const response: JsonResponse = {
                success: true,
                message: 'read sms failed',
                error: err.message
            }
            io.to(socket.id).emit('readSms', response);
        }
    })

    socket.on('listSms', async (data) => {
        io.use(device('LIST CHAT'));
        io.use(device('LIST-CHAT'));
    
        try {
            const options = {
                page: parseInt(data.page),
                limit: parseInt(data.limit),
                sort: { createdAt: -1 }
            }
            const sms = await Sms.paginate({ room: data.room }, options);
            const result = sms.docs.map(async (sms: any) => {
                const attachments = await Attach.find({ message: sms._id });
                const reactions = await Reaction.find({ message: sms._id });

                return { ...sms, attachments, reactions };
            })

            const response: JsonResponse = {
                success: true,
                message: 'read in the room',
                data: result
            }
            io.to(data.room).emit('listSms', response);
        } catch (err: any) {
            console.log(err.message)
            const response: JsonResponse = {
                success: true,
                message: 'list sms failed',
                error: err.message
            }
            io.to(socket.id).emit('listSms', response);
        }
    })

    socket.on('deleteSms', async (data) => {
        io.use(device('DELETE CHAT'));
        io.use(device('DELETE-CHAT'));

        try {
            const sms = await Sms.findById(data.id);
            if (!sms) throw new Error('sms not found');

            await Attach.deleteMany({ message: sms._id });
            await Reaction.deleteMany({ message: sms._id });
            await sms.deleteOne();

            const response: JsonResponse = {
                success: true,
                message: 'read in the room'
            }
            io.to(data.room).emit('deleteSms', response)
        } catch (err: any) {
            console.log(err.message)
            const response: JsonResponse = {
                success: true,
                message: 'delete sms failed',
                error: err.message
            }
            io.to(socket.id).emit('deleteSms', response);
        }
    })

    socket.on('addReaction', async (data) => {
        io.use(device('ADD REACT'));
        io.use(device('ADD-REACT'));

        try {
            await Reaction.create({ message: data.message, hote: socket.data.user._id, emoji: data.emoji });
            const response: JsonResponse = {
                success: true,
                message: 'read in the room'
            }

            io.to(data.room).emit('addReaction', response);
        } catch (err: any) {
            console.log(err.message)
            const response: JsonResponse = {
                success: true,
                message: 'add reaction failed',
                error: err.message
            }
            io.to(socket.id).emit('addReaction', response);
        }
    })

    socket.on('deleteReaction', async (data) => {
        io.use(device('DELETE REACT'));
        io.use(device('DELETE-REACT'));
        
        try {
            await Reaction.deleteOne({ message: data.id, hote: socket.data.user._id });
            const response: JsonResponse = {
                success: true,
                message: 'read in the room'
            }
            io.to(data.room).emit('deleteReaction', response);
        } catch (err: any) {
            console.log(err.message)
            const response: JsonResponse = {
                success: true,
                message: 'add reaction failed',
                error: err.message
            }
            io.to(socket.id).emit('addReaction', response);
        }
    })

}  

export default rooms;
