import mongoose, { Schema, Document, Types } from 'mongoose';
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
  authorization: string[];
  disconnected: string;
}

interface ILeadModel extends mongoose.PaginateModel<ILead> {
    findByPhone(phone: string): Promise<ILead>;
};

const LeadSchema: Schema = new Schema({
    firstname: { 
        type: String,
        trim: true,
        minlength: [3, 'First name must be at least 3 characters'],
        maxlength: [20, 'First name cannot exceed 20 characters']
    },
    lastname: { 
        type: String,
        trim: true,
        minlength: [3, 'Last name must be at least 3 characters'],
        maxlength: [20, 'Last name cannot exceed 20 characters']
    },
    picture: { 
        type: String, 
        trim: true
    },
    phone: { 
        type: String,
        trim: true,
        unique: true
    },
    address: { 
        type: String,
        trim: true
    },
    online: { 
        type: Boolean, 
        default: false 
    },
    isAuthenticated: { 
        type: Boolean, 
        default: false 
    },
    authorization: {
        type: [String],
        default: [
            'READ-ORG',
            'LIST-ORG',

            'CREATE-ORDER',
            'READ-ORDER',
            'LIST-ORDER',
            'UPDATE-ORDER',
            'DELETE-ORDER',
            'COUNT-ORDER',

            'READ-PRODUCT',
            'LIST-PRODUCT',
            'COUNT-PRODUCT',

            'CREATE-RATING',
            'READ-RATING',
            'READ-RATING-PRODUCT',
            'LIST-RATING',
            'COUNT-RATING',

            'SAVE-ATTACHMENT',
            'DOWNLOAD-ATTACHMENT',
            'DELETE-ATTACHMENT',

            'READ-LEAD',
            'UPDATE-LEAD',

            'READ-RELANCE',
        ],
        validate: {
            validator: function(arr: string[]) {
                return arr.length > 0;
            },
            message: 'At least one authorization is required'
        }
    },
    disconnected: { 
        type: String,
        trim: true
    }
}, { 
    timestamps: true
});

LeadSchema.plugin(paginate);

LeadSchema.statics.findByPhone = async function(phone: string): Promise<ILead> {
    return this.findOne({ phone });
};

export default mongoose.model<ILead, ILeadModel>('Lead', LeadSchema);
