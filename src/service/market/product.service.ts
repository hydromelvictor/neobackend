import { PaginateResult } from "mongoose";
import Product, { IProduct } from "../../models/market/product.models";
import { RmProduct, RmProductSchema, RsAccountSchema, RsProduct, RsProductSchema, XrProduct, XrProductSchema } from "./market";


export default class ProductService {
    async filters(q: RmProduct): Promise<any> {
        const filter: any = {};
        if (q.assign) filter.assign = q.assign;
        if (q.org) filter.org = q.org;
        if (q.min) filter.price.$gte = q.min;
        if (q.max) filter.price.$lte = q.max;
        if (q.description) filter.description = new RegExp(q.description, 'i');
        if (q.category) filter.category = new RegExp(q.category, 'i');
        if (q.size) {
            const regex = new RegExp(q.size, 'i');
            filter.sizes = { $in: regex };
        }
        if (q.color) {
            const regex = new RegExp(q.color, 'i');
            filter.colors = { $in: regex };
        }
        if (q.brand) {
            const regex = new RegExp(q.brand, 'i');
            filter.brand = { $in: regex };
        }
        if (q.before) filter.warranty.$lte = q.before;
        if (q.after) filter.warranty.$gte = q.after;

        return filter;
    }

    async create(data: XrProduct): Promise<IProduct> {
        const result = XrProductSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const product = new Product(parsed);
        await product.save();
        return product;
    }

    async get(data: RsProduct): Promise<IProduct> {
        if (!data._id) throw new Error('_di missing');

        const result = RsProductSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;
        
        const product = await Product.findOne(parsed);
        if (!product) throw new Error('product not found');
        return product;
    }

    async find(data: RmProduct, page: number = 1, limit: number = 10): Promise<PaginateResult<IProduct>> {
        const result = RmProductSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const products = await Product.paginate(filter, { page, limit });
        return products;
    }

    async update(query: RsProduct, data: RsProduct): Promise<IProduct> {
        const product = await this.get(query);

        const result = RsProductSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;
        await product.updateOne(data);

        return await this.get({ _id: product._id });
    }

    async delete(data: RsProduct): Promise<boolean> {
        const product = await this.get(data);
        await product.deleteOne();

        return true;
    }

    async size(data: RmProduct): Promise<number> {
        const result = RmProductSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const total = await Product.countDocuments(parsed);
        return total;
    }
}
