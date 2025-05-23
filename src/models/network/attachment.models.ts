import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IAttach extends Document {
    message: Types.ObjectId;
    path: string;
    type: 'image' | 'video' | 'audio' | 'file' ;
    size: number;
}

interface IAttachModel extends mongoose.PaginateModel<IAttach> {};

const AttachSchema = new Schema<IAttach>({
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sms',
        required: true
    },
    path: String,
    type: {
        type: String,
        enum: ['image', 'video', 'audio', 'file'],
        required: true
    },
    size: Number
}, { timestamps: true })

AttachSchema.plugin(paginate);
const Attach = mongoose.model<IAttach, IAttachModel>('Attach', AttachSchema);
export default Attach;