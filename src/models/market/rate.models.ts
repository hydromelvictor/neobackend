import mongoose, { Schema, Document, Types } from 'mongoose';
import market from '../../db/market.db';
import paginate from 'mongoose-paginate-v2';

export interface IRate extends Document {
    _id: Types.ObjectId;
    base: string;
    target: string;
    rate: number;
    provider: string;
    fetchedAt: Date;
}

interface IRateModel extends mongoose.PaginateModel<IRate> {};

const RateSchema = new Schema<IRate>({
    base: String,
    target: String,
    rate: Number,
    provider: String,
    fetchedAt: Date
}, { timestamps: true })
RateSchema.plugin(paginate)
const Rate = market.model<IRate, IRateModel>('Rate', RateSchema);
export default Rate;