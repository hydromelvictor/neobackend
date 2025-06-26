import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface Itrac extends Document {
    _id: Types.ObjectId;
    type: 'deposit' | 'withdrawal' | 'payment';
    amount: number;
    currency: string;
    baseCurrency: string;
    exchangeRate: number;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    description: string;
    from: Schema.Types.ObjectId;
    to: Schema.Types.ObjectId;
    processedAt: Date;
}

interface ItraModel extends mongoose.PaginateModel<Itrac> {};

const TraSchema = new Schema<Itrac>({
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'payment'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'XOF'
    },
    baseCurrency: {
        type: String,
        default: 'XOF'
    },
    exchangeRate: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    description: {
        type: String,
        default: ''
    },
    from: Schema.Types.ObjectId,
    to: Schema.Types.ObjectId,
    processedAt: Date
}, { timestamps: true });

TraSchema.plugin(paginate);

export default mongoose.model<Itrac, ItraModel>('Tracking', TraSchema);