import Account, { IAccount } from "../../models/market/account.models";
import { _RSAccount, _XsAccount, XsAccount } from "../../types/market";
import { PaginateResult, Types } from "mongoose";
import { RsAccount } from "./market";


export default class Service {
    private filters(q: any): any {
        const filter: any = {};

        if (q.min) filter.balance.$gte = q.min;
        if (q.max) filter.balance.$lte = q.max;

        return filter;
    }

    async Create(data: XsAccount): Promise<IAccount> {
        const result = _XsAccount.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const account = new Account(parsed);
        await account.save();

        return account;
    }

    async Get(id: string | Types.ObjectId): Promise<IAccount> {
        const account = await Account.findOne({ owner: id });
        if (!account) throw new Error('account not found');

        return account;
    }

    async Find(data: any, options: any): Promise<PaginateResult<IAccount>> {
        const filter = this.filters(data);
        const accounts = await Account.paginate(filter, options);
        return accounts;
    }

    async Update(id: string | Types.ObjectId, data: RsAccount): Promise<IAccount> {
        const account = await this.Get(id);
        const result = _RSAccount.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        Object.assign(account, parsed);
        await account.save();

        return await this.Get(account._id);
    }

    async Remove(id: string | Types.ObjectId): Promise<boolean> {
        const account = await this.Get(id);
        await account.deleteOne();

        return true;
    }

    async Size(data: any): Promise<number> {
        const filter = this.filters(data);
        const total = await Account.countDocuments(filter);
        return total;
    }
}
