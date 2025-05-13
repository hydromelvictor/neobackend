import mongoose, { Schema, Document, Types } from 'mongoose';
import market from '../../db/market.db';
import paginate from 'mongoose-paginate-v2';

type item = {
    product: Schema.Types.ObjectId,
    quantity: number,
    price: number
}

export interface IOrders extends Document {
    _id: Types.ObjectId;
    lead: Schema.Types.ObjectId;
    sellor: Schema.Types.ObjectId;
    price: number;
    fees: number;
    total: number;
    items: item[];
    shipment: {
        when: Date,
        where: string,
        fee: number
    };
}

interface IOderModel extends mongoose.PaginateModel<IOrders> {};

const IOrderSchema = new Schema<IOrders>({
    lead: {
        type: Schema.Types.ObjectId,
        required: true
    },
    sellor: {
        type: Schema.Types.ObjectId,
        required: true
    },
    price: Number,
    fees: Number,
    total: Number,
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: Number
    }],
    shipment: {
        when: Date,
        where: String,
        fee: Number
    }
}, { timestamps: true });

IOrderSchema.plugin(paginate);
const Order = market.model<IOrders, IOderModel>('Order', IOrderSchema);

export default Order;
