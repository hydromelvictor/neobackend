import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import shadow from '../../db/shadow.db';

export interface IAnnonce extends Document {
    state: 'flottant' | 'avatar' | 'push';
    image: string;
    avatar: Types.ObjectId;
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

interface IAnnonceModel extends mongoose.PaginateModel<IAnnonce> {};

const AnnonceSchema = new Schema<IAnnonce>({
    state: {
        type: String,
        enum: ['flottant', 'avatar', 'push']
    },
    image: String,
    avatar: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    },
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
        enum: ['pending']
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
AnnonceSchema.plugin(paginate);
const Annonce = shadow.model<IAnnonce, IAnnonceModel>('Annonce', AnnonceSchema);
export default Annonce;