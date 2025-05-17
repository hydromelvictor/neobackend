import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import shadow from '../../db/shadow.db';

export interface IDevice extends Document {
    _id: Types.ObjectId;
    hote: Types.ObjectId;
    sessionId: string;                  // ID de session (cookie, token temporaire)
    type: string;                        // Type d'activité ('login', 'logout', 'register', 'view', 'click', etc.)
    method: string;                  // Page précédente (header referer)
    ip: string;                          // Adresse IP
    userAgent: string;                   // Navigateur + OS
    device?: string;                     // Type d'appareil : mobile, desktop, tablet
    browser?: string;                    // Détail du navigateur
    os?: 'Linux' | 'Mac' | 'iOS' | 'Windows' | 'Android' | 'Other';                         // Système d’exploitation
    location?: {
        country?: string;
        city?: string;
        region?: string;
        lat?: number;
        lon?: number;
    };
    metadata?: Record<string, any>;     // Autres données spécifiques à l'action
}

interface IDeviceModel extends mongoose.PaginateModel<IDevice> {};

const DeviceSchema = new Schema<IDevice>({
    hote: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    },
    sessionId: { type: String },
    type: { type: String, required: true },         // e.g., 'auth', 'navigation', 'interaction'
    method: { type: String, required: true },       // HTTP Method
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    device: { type: String },
    browser: { type: String },
    os: { 
        type: String,
        enum: ['Linux', 'Mac', 'iOS', 'Windows', 'Android', 'Other'],
        default: 'Other'
    },
    location: {
        country: { type: String },
        city: { type: String },
        region: { type: String },
        lat: { type: Number },
        lon: { type: Number },
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });
DeviceSchema.plugin(paginate);
const Device = shadow.model<IDevice, IDeviceModel>('Device', DeviceSchema);
export default Device;