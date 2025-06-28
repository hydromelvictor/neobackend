import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

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
        enum: ['lead', 'admin', 'manager', 'employee', 'neo'],
        default: 'neo'
    }
}, { timestamps: true });
GuestSchema.plugin(paginate);
const Guest = mongoose.model<IGuest, IGuestModel>('Guest', GuestSchema);
export default Guest;