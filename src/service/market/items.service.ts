import { PaginateResult, Types } from "mongoose";
import Order, { IOrders } from "../../models/market/items.models";
import { _RsOrder, RsOrder, _XsOrder, XsOrder } from "../../types/market";
import Product from "../../models/market/product.models";


export default class Service {
    private filters(q: any): any {
        const filter: any = {};

        if (q.lead) filter.lead = q.lead;
        if (q.sellor) filter.sellor = q.sellor;
        if (q.max) filter.total.$lte = q.max;
        if (q.min) filter.total.$gte = q.min;
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

    async Create(data: XsOrder): Promise<IOrders> {
        const result = _XsOrder.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const order = new Order(parsed);
        order.price = 0;
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (!product) throw new Error('product not found');

            if (product.price.min > item.price || product.price.max < item.price)
                throw new Error('sorry price not conform');
            order.price += item.price * item.quantity;
        }
        order.fees = order.price * 0.05;
        order.total = order.price + order.fees;
        await order.save();

        return order;
    }

    async Get(id: string | Types.ObjectId): Promise<IOrders> {
        const order = await Order.findById(id);
        if (!order) throw new Error('order not found');

        return order;
    }

    async Find(data: any, options: any): Promise<PaginateResult<IOrders>> {
        const filter = this.filters(data);
        const orders = await Order.paginate(filter, options);
        return orders;
    }

    async Update(id: string | Types.ObjectId, data: RsOrder): Promise<IOrders> {
        const order = await this.Get(id);
        const result = _RsOrder.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        Object.assign(order, parsed);
        order.price = 0;
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (!product) throw new Error('product not found');

            if (product.price.min > item.price || product.price.max < item.price)
                throw new Error('sorry price not conform');
            order.price += item.price * item.quantity;
        }
        order.fees = order.price * 0.05;
        order.total = order.price + order.fees;
        await order.save();

        return await this.Get(order._id);
    }

    async Remove(id: string | Types.ObjectId): Promise<boolean> {
        const order = await this.Get(id);
        await order.deleteOne();

        return true;
    }

    async Size(data: any): Promise<number> {
        const filter = this.filters(data);
        const total = Order.countDocuments(filter);
        return total;
    }
}
