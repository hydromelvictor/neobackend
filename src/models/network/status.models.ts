import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import network from '../../db/network.db';

export interface IStatus extends Document {
    org: Types.ObjectId;
    path: string;
    text: string;
    link: string;
}

interface IStatusModel extends mongoose.PaginateModel<IStatus> {};

const StatuSchema = new Schema<IStatus>({
    org: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    path: String,
    text: String,
    link: String
}, { timestamps: true })
StatuSchema.plugin(paginate);
const Status = network.model<IStatus, IStatusModel>('Status', StatuSchema);
export default Status;