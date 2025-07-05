import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IAd extends Document {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  picture?: string;
  phone: string;
  email: string;
  cni: string;
  position: string;
  recovery: string;
  online: boolean;
  isAuthenticated: boolean;
  authorization: string[];
  disconnected: string;
}

interface IAdminModel extends mongoose.PaginateModel<IAd> {
    findEmail(email: string): Promise<IAd>;
};

const AdSchema = new Schema<IAd>({
    firstname: { type: String },
    lastname: { type: String },
    picture: { type: String },
    phone: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    cni: { type: String, unique: true, required: true },
    position: { type: String },
    recovery: {
        type: String,
        unique: true
    },
    online: { type: Boolean, default: false },
    isAuthenticated: { type: Boolean, default: false },
    authorization: {
        type: [String],
        default: []
    },
    disconnected: { type: String }
}, { timestamps: true });

AdSchema.plugin(paginate);

AdSchema.statics.findEmail = async function(email: string): Promise<IAd> {
    return this.findOne({ email });
};

const Admin = mongoose.model<IAd, IAdminModel>('Admin', AdSchema);

export default Admin;
