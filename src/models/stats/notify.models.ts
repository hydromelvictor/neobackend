import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface Inot extends Document {
    state: 'flottant' | 'avatar' | 'push';
    image: string;
    avatar: string;
    name: string;
    path: string;
    target: {
        country: string,
        city: string
    },
    message: string;
    expired: Date;
    status: 'pending' | 'running' | 'pass';
    view: {
        size: number,
        interested: number
    }
}

interface INModel extends mongoose.PaginateModel<Inot> {};

const NotSchema = new Schema<Inot>({
    state: {
        type: String,
        enum: ['flottant', 'avatar', 'push']
    },
    image: String,
    avatar: String,
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    target: {
        country: String,
        city: String
    },
    message: {
        type: String,
    },
    expired: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'running', 'pass'],
        default: 'pending'
    },
    view: {
        size: {
            type: Number,
            default: 0
        },
        // determiner
        interested: {
            type: Number,
            default: 0
        }
    }
}, { timestamps: true });

NotSchema.plugin(paginate);
const Notify = mongoose.model<Inot, INModel>('Annonce', NotSchema);
export default Notify;