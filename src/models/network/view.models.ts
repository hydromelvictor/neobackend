import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import network from '../../db/network.db';

export interface IView extends Document {
    status: Types.ObjectId;
    viewer: Types.ObjectId;
}

interface IViewModel extends mongoose.PaginateModel<IView> {};

const ViewSchema = new Schema<IView>({
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
        required: true
    },
    viewer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true })
ViewSchema.plugin(paginate);
const View = network.model<IView, IViewModel>('View', ViewSchema);
export default View;