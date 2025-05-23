import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IAction extends Document {
    _id: Types.ObjectId;
    account: Schema.Types.ObjectId;
    type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'refund';
    amount: number;
    currency: string;
    baseCurrency: string;
    exchangeRate: number;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    description: string;
    from: Schema.Types.ObjectId;
    to: Schema.Types.ObjectId;
    metadata: any;
    processedAt: Date;
}

interface IActionModel extends mongoose.PaginateModel<IAction> {};

const ActionSchema = new Schema<IAction>({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'transfer', 'payment', 'refund'],
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
    from: {
        type: Types.ObjectId,
        ref: 'Account',
        required: function (this: any) {
            return this.type === 'transfer';
        }
    },
    to: {
        type: Types.ObjectId,
        ref: 'Account',
        required: function (this: any) {
            return this.type === 'transfer';
        }
    },
    metadata: {
        type: Schema.Types.Mixed,
        default: {}
    },
    processedAt: {
        type: Date
    }
}, { timestamps: true });

ActionSchema.plugin(paginate);

const Transaction = mongoose.model<IAction, IActionModel>('Transaction', ActionSchema);

export default Transaction;
