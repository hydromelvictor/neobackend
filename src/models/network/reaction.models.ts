import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import network from '../../db/network.db';

export interface IReact extends Document {
    message: Types.ObjectId;
    hote: Types.ObjectId;
    emoji: {
        name: string,
        symbole: string;
    };
}

interface IReactModel extends mongoose.PaginateModel<IReact> {};

const ReactSchema = new Schema<IReact>({
    message: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Sms'
    },
    hote: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    emoji: {
        name: String,
        symbole: String
    }
}, { timestamps: true })
ReactSchema.plugin(paginate);
const Reaction = network.model<IReact, IReactModel>('Reaction', ReactSchema);
export default Reaction;