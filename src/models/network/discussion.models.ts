import mongoose, { Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IRo extends Document {
    status: 'private' | 'public';
    name?: string;
}

interface IRoModel extends mongoose.PaginateModel<IRo> {};

const Roo = new Schema<IRo>({
    status: {
        type: String,
        enum: ['private', 'public'],
        default: 'private'
    },
    name: String
}, { timestamps: true })
Roo.plugin(paginate);
const Room = mongoose.model<IRo, IRoModel>('Room', Roo);
export default Room;