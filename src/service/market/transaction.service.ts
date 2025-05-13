import { PaginateResult } from "mongoose";
import Transaction, { IAction } from "../../models/market/transaction.models";
import { RmTrans, RmTranSchema, RsTrans, RsTranSchema, XrTrans, XrTranSchema } from "./market"



export default class TransactionService {
    async filters(q: RmTrans): Promise<any> {
        const filter: any = {};

        if (q.account) filter.account = q.account;
        if (q.type) filter.type = q.type;
        if (q.status) filter.status = q.status;
        if (q.description) filter.description = q.description;
        if (q.min) filter.amount.$gte = q.min;
        if (q.max) filter.amount.$lte = q.max;
        if (q.before) filter.processedAt.$lte = q.before;
        if (q.after) filter.processedAt.$gte = q.after;

        return filter;
    }

    async create(data: XrTrans): Promise<IAction> {
        const result = XrTranSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const trans = new Transaction(parsed);
        await trans.save();
        return trans;
    }

    async get(data: RsTrans): Promise<IAction> {
        if (!data._id) throw new Error('_id missing');
        const result = RsTranSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const trans = await Transaction.findOne(parsed);
        if (!trans) throw new Error('transaction not found');

        return trans;
    }

    async find(data: RmTrans, page: number = 1, limit: number = 10): Promise<PaginateResult<IAction>> {
        const result = RmTranSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const trans = await Transaction.paginate(filter, { page, limit });
        return trans;
    }

    async update(query: RsTrans, data: RsTrans): Promise<IAction> {
        const trans = await this.get(query);

        const result = RsTranSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;
        await trans.updateOne(parsed);

        return await this.get({ _id: trans._id });
    }

    async delete(data: RsTrans): Promise<boolean> {
        const trans = await this.get(data);
        await trans.deleteOne();

        return true;
    }

    async size(data: RmTrans): Promise<number> {
        const result = RmTranSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const total = await Transaction.countDocuments(parsed);
        return total;
    }
}