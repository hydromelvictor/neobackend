import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

interface Irel extends Document {
    _id: Types.ObjectId;
    assign: Types.ObjectId;
    lead: Types.ObjectId;
    relance: Date;
}

interface IrelModel extends mongoose.PaginateModel<Irel> {};

const relSchema = new Schema<Irel>({
    assign: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Neo'
    },
    lead: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Lead'
    },
    relance: {
        type: Date,
        required: true
    }
}, { timestamps: true });

relSchema.plugin(paginate);
export default mongoose.model<Irel, IrelModel>('Relance', relSchema);