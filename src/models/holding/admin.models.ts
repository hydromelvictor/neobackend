import mongoose, { Schema, Document, Types } from 'mongoose';
import holding from '../../db/holding.db';
import paginate from 'mongoose-paginate-v2';

// Interfaces
export interface IAdmin extends Document {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  picture?: string;
  phone: string;
  email: string;
  cni: string;
  position: string;
  authority: boolean;
  online: boolean;
  isAuthenticated: boolean;
  staff: boolean;
  authorization: string[];
  disconnected: string;
}

interface IAdminModel extends mongoose.PaginateModel<IAdmin> {};

// Schéma utilisateur
const AdminSchema = new Schema<IAdmin>({
  firstname: { type: String },
  lastname: { type: String },
  picture: { type: String },
  phone: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  cni: { type: String, unique: true },
  position: { type: String },
  authority: { type: Boolean, default: false },
  online: { type: Boolean, default: false },
  isAuthenticated: { type: Boolean, default: false },
  staff: { type: Boolean, default: false },
  authorization: [String],
  disconnected: { type: String }
}, { timestamps: true });

// Plugin de pagination
AdminSchema.plugin(paginate);

// Modèle
const Admin = holding.model<IAdmin, IAdminModel>('Admin', AdminSchema);

export default Admin;
