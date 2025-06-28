import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IAgent extends Document {
    _id: Types.ObjectId;
    org: Types.ObjectId;
    fullname: string;
    picture?: string;
    online: boolean;
    responsability: string;
    sex: string;
    mission: string;
    context: string;
    task: string[];
    version: string;
}

interface IAsModel extends mongoose.PaginateModel<IAgent> { };

const IASchema = new Schema<IAgent>({
    org: { type: Schema.Types.ObjectId, ref: 'Org', required: true },
    fullname: { type: String },
    picture: { type: String },
    online: { type: Boolean, default: true },
    responsability: { type: String },
    sex: {
        type: String,
        enum: ['M', 'F'],
        required: true
    },
    mission: { type: String },
    context: { type: String },
    task: [{ type: String }],
    version: { type: String },
}, { timestamps: true })

IASchema.plugin(paginate);

const Neo = mongoose.model<IAgent, IAsModel>('Neo', IASchema);

export default Neo;