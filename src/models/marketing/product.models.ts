import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface Iprd extends Document {
    _id: Types.ObjectId;
    assign: Schema.Types.ObjectId;
    org: Schema.Types.ObjectId;
    online: boolean;
    name: string;
    description: string;
    price: number[];
    stock: number;
    category: string;
    media: string[];
    brand: string;
    features: string[];
    address: string;
    sizes: string[];
    colors: string[];
    delivery: {
        in: number,
        out: number
    }
    // service
    ondemand: string;
    warranty: string;
    bonus: Schema.Types.ObjectId[];
}

interface IprdModel extends mongoose.PaginateModel<Iprd> {};

const prdSchema = new Schema<Iprd>({
    assign: Schema.Types.ObjectId,
    org: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Org'
    },
    name: String,
    description: String,
    price: {
        type: [Number],
        required: true,
        min: 0,
        max: 2,
        validator: function(v: number[]) {
            if (v[0] >= v[1]) return false;
            return true;
        }
    },
    online: {
        type: Boolean,
        default: true
    },
    stock: Number,
    category: String,
    media: [String],
    brand: String,
    features: [String],
    address: String,
    sizes: [String],
    colors: [String],
    delivery: {
        in: Number,
        out: Number
    },
    ondemand: String,
    warranty: String,
     bonus: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

prdSchema.plugin(paginate);
const Product = mongoose.model<Iprd, IprdModel>('Product', prdSchema);
export default Product;
