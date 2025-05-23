import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import View from './view.models';

export interface IMeet extends Document {
    hotes: Types.ObjectId[];
    subject: string;
    description: string;
    start: Date;
    finish: Date;
    status: 'pending' | 'running' | 'finished'
}

interface IMeetModel extends mongoose.PaginateModel<IMeet> {};

const MeetSchema = new Schema<IMeet>({
    hotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        reqired: true
    }],
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    start: {
        type: Date,
        required: true,
    },
    finish: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'running', 'finished'],
        default: 'pending',
    }
}, { timestamps: true });
MeetSchema.plugin(paginate);
const Meet = mongoose.model<IMeet, IMeetModel>('Meet', MeetSchema);
export default Meet;