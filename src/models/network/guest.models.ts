import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IGuest extends Document {
    room: Types.ObjectId;
    hote: Types.ObjectId;
    role: string;
}

interface IGuestModel extends mongoose.PaginateModel<IGuest> {};

const GuestSchema = new Schema<IGuest>({
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    hote: {
        type: Schema.Types.ObjectId,
        required: true
    },
    role: {
        type: String,
        enum: ['lead', 'org']
    }
}, { timestamps: true });
GuestSchema.plugin(paginate);
const Guest = mongoose.model<IGuest, IGuestModel>('Guest', GuestSchema);
export default Guest;