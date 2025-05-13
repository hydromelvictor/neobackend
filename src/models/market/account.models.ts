import mongoose, { Schema, Document, Types } from 'mongoose';
import market from '../../db/market.db';
import paginate from 'mongoose-paginate-v2';

export interface IAccount extends Document {
    _id: Types.ObjectId;
    owner: Types.ObjectId;
    currency: string;
    balance: number;
}

interface IAccountModel extends mongoose.PaginateModel<IAccount> {};

const AccountSchema = new Schema<IAccount>({
    owner: { type: mongoose.Schema.Types.ObjectId, unique: true, required: true },
    currency: { type: String, default: 'XOF' },
    balance: { type: Number, default: 0 }
}, { timestamps: true });

AccountSchema.plugin(paginate);

const Account = market.model<IAccount, IAccountModel>('Account', AccountSchema);
export default Account;
