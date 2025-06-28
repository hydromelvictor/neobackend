import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

type item = {
    product: Schema.Types.ObjectId,
    quantity: number,
    price: number
}

type ship = {
    when: Date,
    where: string,
    fee: number
}


export interface IOrd extends Document {
    _id: Types.ObjectId;
    lead: Schema.Types.ObjectId;
    assign: Schema.Types.ObjectId;
    total: number;
    fee: number;
    items: item[];
    shipment?: ship;
    status: string;
}

interface IOrdModel extends mongoose.PaginateModel<IOrd> {};

const OrdSchema = new Schema<IOrd>({
    lead: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Lead'
    },
    assign: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Neo'
    },
    total: Number,
    fee: Number,
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
    },
    status: {
        type: String,
        enum: ['init', 'doing', 'done'],
        default: 'init'
    }
}, { timestamps: true });

OrdSchema.plugin(paginate);
export default mongoose.model<IOrd, IOrdModel>('Order', OrdSchema);