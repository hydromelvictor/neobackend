import { PaginateResult, Types } from "mongoose";
import Product, { IProduct } from "../../models/market/product.models";
import { _RsProduct, _XsProduct, RsProduct, XsProduct } from "../../types/market";



export default class Service {
    private filters(q: any): any {
        const filter: any = {};
        
        if (q.assign) filter.assign = q.assign;
        if (q.org) filter.org = q.org;
        if (q.min) filter.price.min.$gte = q.min;
        if (q.max) filter.price.max.$lte = q.max;
        if (q.description) filter.description = { $regex: q.description, $options: 'i' };
        if (q.category) filter.category = { $regex: q.category, $options: 'i' };
        if (q.size) filter.sizes = { $in: { $regex: q.size, $options: 'i' } };
        if (q.size) filter.colors = { $in: { $regex: q.color, $options: 'i' } };
        if (q.brand) filter.brand = { $in: { $regex: q.brand, $options: 'i' } };
        if (q.wbefore) filter.warranty.$lte = q.before;
        if (q.wversion) filter.warranty.$gte = q.after;
        if (q.before) {
            const date = new Date(q.before);
            date.setHours(23, 59, 59, 999);
            filter.createdAt = { $lte: date };
        }
        if (q.after) {
            const date = new Date(q.after);
            date.setHours(0, 0, 0, 0);
            filter.createdAt = { $gte: date };
        }

        return filter;
    }

    async Create(data: XsProduct): Promise<IProduct> {
        const result = _XsProduct.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const product = new Product(parsed);
        await product.save();
        return product;
    }

    async Get(id: string | Types.ObjectId): Promise<IProduct> {
        const product = await Product.findById(id);
        if (!product) throw new Error('product not found');

        return product;
    }

    async Find(data: any, options: any): Promise<PaginateResult<IProduct>> {
        const filter = this.filters(data);
        const products = Product.paginate(filter, options);
        return products;
    }

    async Update(id: string | Types.ObjectId, data: RsProduct): Promise<IProduct> {
        const product = await this.Get(id);
        const result = _RsProduct.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        Object.assign(product, parsed);
        await product.save();

        return await this.Get(product._id);
    }

    async Remove(id: string | Types.ObjectId): Promise<boolean> {
        const product = await this.Get(id);
        await product.deleteOne();

        return true;
    }

    async Size(data: any): Promise<number> {
        const filter = this.filters(data);
        const total = Product.countDocuments(filter);

        return total;
    }
}
