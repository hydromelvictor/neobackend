import { PaginateResult } from "mongoose";
import Order, { IOrders } from "../../models/market/items.models";
import { RmOrder, RmOrderSchema, RsOrder, RsOrderSchema, XrOrder, XrOrderSchema } from "./market";



export default class OrderService {
    async filters(q: RmOrder): Promise<any> {
        const filter: any = {};

        if (q.lead) filter.lead = q.lead;
        if (q.sellor) filter.sellor = q.sellor;
        if (q.sub) filter.total.$lte = q.sub;
        if (q.sup) filter.total.$gte = q.sup;

        return filter;
    }

    async create(data: XrOrder): Promise<IOrders> {
        const result = XrOrderSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const order = new Order(parsed);
        await order.save();
        return order;
    }

    async get(data: RsOrder): Promise<IOrders> {
        if (!data._id) throw new Error('_id missing');

        const result = RsOrderSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const order = await Order.findOne(parsed);
        if (!order) throw new Error('order not found');

        return order;
    }

    async find(data: RmOrder, page: number = 1, limit: number = 10): Promise<PaginateResult<IOrders>> {
        const result = RmOrderSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const orders = await Order.paginate(filter, { page, limit });

        return orders;
    }

    async update(query: RsOrder, data: RsOrder): Promise<IOrders> {
        const order = await this.get(query);

        const result = RsOrderSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;
        await order.updateOne(data);

        return await this.get({ _id: order._id });
    }

    async delete(data: RsOrder): Promise<boolean> {
        const order = await this.get(data);
        await order.deleteOne();
        return true;
    }

    async total(data: RmOrder): Promise<number> {
        const result = RmOrderSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const total = await Order.countDocuments(parsed);
        return total;
    }
}