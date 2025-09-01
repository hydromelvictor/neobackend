import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface Inv extends Document {
    _id: Types.ObjectId;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT';
    amount: number;
    currency: string;
    baseCurrency: string;
    exchangeRate: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    description: string;
    from: Types.ObjectId;
    to: Types.ObjectId;
    processedAt: Date;
}

interface InvModel extends mongoose.PaginateModel<Inv> {};

const TraSchema = new Schema<Inv>({
    type: {
        type: String,
        enum: ['DEPOSIT', 'WITHDRAWAL', 'PAYMENT'],
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
        enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
        default: 'PENDING',
    },
    description: {
        type: String,
        default: ''
    },
    from: Types.ObjectId,
    to: Types.ObjectId,
    processedAt: Date
}, { timestamps: true });

TraSchema.plugin(paginate);

export default mongoose.model<Inv, InvModel>('Invoice', TraSchema);