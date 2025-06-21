import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';


export interface IDev extends Document {
    _id: Types.ObjectId;
    hote?: Types.ObjectId;
    path?: string;
    type?: string;
    method?: string;
    ip?: string;
    agent?: string;
    browser?: string;
    os?: 'Linux' | 'Mac' | 'iOS' | 'Windows' | 'Android' | 'Other';
    location?: {
        country?: string;
        city?: string;
        region?: string;
        lat?: number;
        lon?: number;
    }
}

interface IDevModel extends mongoose.PaginateModel<IDev> {};

const DevSchema = new Schema<IDev>({
    hote: mongoose.Schema.Types.ObjectId,
    path: String,
    type: String,
    method: String,
    ip: String,
    agent: String,
    browser: String,
    os: String,
    location: {
        country: String,
        city: String,
        region: String,
        lat: Number,
        lon: Number
    }
}, { timestamps: true });

DevSchema.plugin(paginate);
const Device = mongoose.model<IDev, IDevModel>('Device', DevSchema);

export { Device as default };
