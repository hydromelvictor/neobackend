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
  authorization: string[];
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
    authorization: {
      type: [String],
      default: [
        'READ_LEAD',
        'UPDATE_LEAD',

        'READ_ACCOUNT',

        'CREATE_ORDER',
        'READ_ORDER',
        'LIST_ORDER',
        'UPDATE_ORDER',

        'READ_PRODUCT',
        'LIST_PRODUCT',

        'CREATE_REVIEW',
        'READ_REVIEW',
        'LIST_REVIEW',
        'UPDATE_REVIEW',
        'DELETE_REVIEW',

        'CREATE_TRANSACTION',
        'READ_TRANSACTION',
        'LIST_TRANSACTION',
        'UPDATE_TRANSACTION',

        'CREATE_ATTACHMENT',
        'READ_ATTACHMENT',
        'LIST_ATTACHMENT',
        'UPDATE_ATTACHMENT',
        'DELETE_ATTACHMENT',

        'CREATE_DISCUSSION',
        'READ_DISCUSSION',
        'LIST_DISCUSSION',
        'UPDATE_DISCUSSION',
        'DELETE_DISCUSSION',

        'CREATE_MEET',
        'READ_MEET',
        'LIST_MEET',

        'CREATE_MESSAGE',
        'READ_MESSAGE',
        'LIST_MESSAGE',
        'UPDATE_MESSAGE',
        'DELETE_MESSAGE',

        'CREATE_REACTION',
        'READ_REACTION',
        'LIST_REACTION',
        'UPDATE_REACTION',
        'DELETE_REACTION',

        'READ_STATUS',
        'LIST_STATUS',

        'CREATE_VIEW',
        'READ_VIEW',
        'LIST_VIEW',

        'READ_ANNONCE',
        'LIST_ANNONCE',
    ]
    },
    disconnected: { type: String }
}, { timestamps: true });

// Plugin de pagination
LeadSchema.plugin(paginate);

// Modèle
const Lead = holding.model<ILead, ILeadModel>('Lead', LeadSchema);

export default Lead;
