import mongoose, { Schema, Document, Types } from 'mongoose';
import holding from '../../db/holding.db';
import paginate from 'mongoose-paginate-v2';


export interface ILead extends Document {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  picture?: string;
  phone: string;
  address: string;
  online: boolean;
  isAuthenticated: boolean;
  staff: boolean;
  disconnected: string;
}

interface ILeadModel extends mongoose.PaginateModel<ILead> {};

const LeadSchema = new Schema<ILead>({
    firstname: { type: String },
    lastname: { type: String },
    picture: { type: String },
    phone: { type: String, unique: true },
    address: { type: String },
    online: { type: Boolean, default: false },
    isAuthenticated: { type: Boolean, default: false },
    staff: { type: Boolean, default: false },
    disconnected: { type: String }
}, { timestamps: true });

// Plugin de pagination
LeadSchema.plugin(paginate);

// Modèle
const Lead = holding.model<ILead, ILeadModel>('Lead', LeadSchema);

export default Lead;
