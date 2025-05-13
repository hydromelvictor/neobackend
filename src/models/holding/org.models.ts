import mongoose, { Schema, Document, Types } from 'mongoose';
import holding from '../../db/holding.db';
import paginate from 'mongoose-paginate-v2';

export interface IOrg extends Document {
    _id: Types.ObjectId;
    reason: string;
    mentor?: Schema.Types.ObjectId;
    social: 'SNC' | 'SCS' | 'SA' | 'SAS' | 'SASU' | 'SARL' | 'EURL' | 'SCOP' | 'SCIC' | 'EI' | 'EIRL' | 'Micro-entreprise' | 'SEP' | 'GIE' | 'SCI/SCP/...';
    country: string;
    state: string;
    address: string;
    location: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
    phone: string[];
    email: string;
    sector: string;
    service: string;
    area?: string;
    picture?: string;
}

interface IOrgModel extends mongoose.PaginateModel<IOrg> {};

const OrgSchema = new Schema<IOrg>({
    reason: { type: String, unique: true },
    mentor: { 
        type: Schema.Types.ObjectId,
        ref: 'Mentor'
    },
    social: { type: String },
    country: { type: String },
    state: { type: String },
    address: { type: String },
    location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true
        }
    },
    phone: [{ type: String }],
    email: { type: String, unique: true },
    sector: { type: String },
    service: { type: String },
    area: { type: String },
    picture: { type: String }
}, { timestamps: true });

OrgSchema.plugin(paginate);

const Org = holding.model<IOrg, IOrgModel>('Org', OrgSchema);

export default Org;
