import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import network from '../../db/network.db';

export interface IGuest extends Document {
    discussion: Types.ObjectId;
    hote: Types.ObjectId;
    role: string;
}

interface IGuestModel extends mongoose.PaginateModel<IGuest> {};

const GuestSchema = new Schema<IGuest>({
    discussion: {
        type: Schema.Types.ObjectId,
        ref: 'Discussion',
        required: true
    },
    hote: {
        type: Schema.Types.ObjectId,
        required: true
    },
    role: {
        type: String,
        enum: ['member', 'admin', 'owner'],
        default: 'member'
    }
}, { timestamps: true });
GuestSchema.plugin(paginate);
const Guest = network.model<IGuest, IGuestModel>('Guest', GuestSchema);
export default Guest;