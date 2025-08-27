import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IOrg extends Document {
    _id: Types.ObjectId;
    reason: string;
    manager: Types.ObjectId;
    referer?: Types.ObjectId;
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
    employees?: string;
    sector: string;
    service: string;
    area?: string;
    picture?: string;
    client?: string;
    access: boolean;
}

interface IOrgModel extends mongoose.PaginateModel<IOrg> {};

const orgSchema = new Schema<IOrg>({
    reason: {
        type: String,
        required: true,
        unique: true
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Manager',
        required: true
    },
    referer: {
        type: Schema.Types.ObjectId,
        ref: 'Referer'
    },
    social: {
        type: String,
        required: true,
        enum: ['SNC', 'SCS', 'SA', 'SAS', 'SASU', 'SARL', 'EURL', 'SCOP', 'SCIC', 'EI', 'EIRL', 'Micro-entreprise', 'SEP', 'GIE', 'SCI/SCP/...']
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    phone: {
        type: [String],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    sector: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    employees: {
        type: String,
        default: '1 - 5',
        enum: ['1 - 5', '6 - 10', '11 - 20', '21 - 50', '51 - 100', '101 - 200', '201 - 500', '501 - 1000', '1001 et plus']
    },
    area: {
        type: String
    },
    picture: {
        type: String
    },
    client: {
        type: String
    },
    access: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

orgSchema.plugin(paginate);

export default mongoose.model<IOrg, IOrgModel>('Org', orgSchema);