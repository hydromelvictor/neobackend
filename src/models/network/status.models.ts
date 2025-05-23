import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

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
const Status = mongoose.model<IStatus, IStatusModel>('Status', StatuSchema);
export default Status;