import mongoose, { Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IDisc extends Document {
    status: 'private' | 'public';
    name?: string;
}

interface IDiscModel extends mongoose.PaginateModel<IDisc> {};

const Disc = new Schema<IDisc>({
    status: {
        type: String,
        enum: ['private', 'public'],
        default: 'private'
    },
    name: String
}, { timestamps: true })
Disc.plugin(paginate);
const Discussion = mongoose.model<IDisc, IDiscModel>('Discussion', Disc);
export default Discussion;