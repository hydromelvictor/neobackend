import mongoose, { Schema, Document, Types, Model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface Ix extends Document {
    _id: Types.ObjectId;
    name: string;
    balance: number;
}

interface IxModel extends Model<Ix> {
    findByName(name: string): Promise<Ix | null>;
}

const XcSchema = new Schema<Ix>({
    name: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 }
});

XcSchema.statics.findByName = function(name: string) {
    return this.findOne({ name });
};

XcSchema.plugin(paginate);
export default mongoose.model<Ix, IxModel>('Xaccount', XcSchema);
