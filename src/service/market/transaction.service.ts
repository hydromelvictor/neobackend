import { PaginateResult, Types } from "mongoose";
import Transaction, { IAction } from "../../models/market/transaction.models";
import { _RsTrans, _XsTrans, RsTrans, XsTrans } from "../../types/market";



export default class TransactionService {
    private filters(q: any): any {
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

    async Create(data: XsTrans): Promise<IAction> {
        const result = _XsTrans.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const trans = new Transaction(parsed);
        await trans.save();
        return trans;
    }

    async Get(id: string | Types.ObjectId): Promise<IAction> {
        const trans = await Transaction.findById(id);
        if (!trans) throw new Error('transaction not found');

        return trans;
    }

    async Find(data: any, options: any): Promise<PaginateResult<IAction>> {
        const filter = await this.filters(data);
        const trans = await Transaction.paginate(filter, options);
        return trans;
    }

    async Update(id: string | Types.ObjectId, data: RsTrans): Promise<IAction> {
        const trans = await this.Get(id);

        const result = _RsTrans.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;
        
        Object.assign(trans, parsed);
        await trans.save();

        return await this.Get(trans._id);
    }

    async Remove(id: string | Types.ObjectId): Promise<boolean> {
        const trans = await this.Get(id);
        await trans.deleteOne();

        return true;
    }

    async Size(data: any): Promise<number> {
        const filter = this.filters(data);

        const total = await Transaction.countDocuments(filter);
        return total;
    }
}