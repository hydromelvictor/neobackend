import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IProduct extends Document {
    _id: Types.ObjectId;
    assign: Schema.Types.ObjectId;
    org: Schema.Types.ObjectId;
    name: string;
    description: string;
    price: {
        min: number,
        max: number
    };
    stock: number;
    category: string;
    media: string[];
    brand: string;
    features: string[];
    address: string;
    sizes: string[];
    colors: string[];
    delivery: {
        internal: number,
        external: number,
        service: string;
    };
    warranty: string;
    bonus: Schema.Types.ObjectId[];
}

interface IPrdModel extends mongoose.PaginateModel<IProduct> {};

const ProductSchema = new Schema<IProduct>({
    assign: Schema.Types.ObjectId,
    org: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: String,
    description: String,
    price: {
        normal: Number,
        discount: Number
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
        internal: Number,
        external: Number,
        service: String
    },
    warranty: String,
    bonus: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { timestamps: true })

ProductSchema.plugin(paginate);
const Product = mongoose.model<IProduct, IPrdModel>('Product', ProductSchema);

export default Product;
