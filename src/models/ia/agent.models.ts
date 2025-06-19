import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IAs extends Document {
    _id: Types.ObjectId;
    org: Types.ObjectId;
    online: boolean;
    fullname: string;
    picture: string;
    responsability: string;
    sex: string;
    mission: string;
    context: string;
    task: string[];
    tools: string[];
    resources: Types.ObjectId[],
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
    mission: { type: String },
    context: { type: String },
    task: [{ type: String }],
    tools: [{ type: String }],
    resources: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }],
    version: { type: String },
}, { timestamps: true })

IASchema.plugin(paginate);
const Ia = mongoose.model<IAs, IAsModel>('Ia', IASchema);
export default Ia;
