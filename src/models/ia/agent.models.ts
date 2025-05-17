import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import ia from '../../db/ia.db';

export interface IAs extends Document {
    _id: Types.ObjectId;
    org: Types.ObjectId;
    online: boolean;
    fullname: string;
    picture: string;
    responsability: string;
    sex: string;
    role: string;
    mission: string;
    context: string;
    task: string;
    tools: string;
    version: string;
}

interface IAsModel extends mongoose.PaginateModel<IAs> {};

const IASchema = new Schema<IAs>({
    org: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    online: { type: Boolean, default: true },
    fullname: { type: String },
    picture: { type: String },
    responsability: { type: String },
    sex: { 
        type: String,
        max: 1,
        min: 1
    },
    role: { type: String },
    mission: { type: String },
    context: { type: String },
    task: { type: String },
    version: { type: String },
}, { timestamps: true })

IASchema.plugin(paginate);
const Ia = ia.model<IAs, IAsModel>('Ia', IASchema);
export default Ia;
