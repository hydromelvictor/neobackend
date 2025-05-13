import { PaginateResult } from "mongoose";
import Account, { IAccount } from "../../models/market/account.models";
import { RmAccount, RmAccountSchema, RsAccount, RsAccountSchema, XrAccount, XrAccountSchema } from "./market";


export default class AccountService {
    async filters(q: RmAccount): Promise<any> {
        const filter: any = {}
        if (q.min) filter.balance.$gte = q.min;
        if (q.max) filter.balance.$lte = q.max

        return filter;
    }

    async create(data: XrAccount): Promise<IAccount> {
        const result = XrAccountSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const account = new Account(parsed);
        await account.save();
        return account;
    }

    async get(data: RsAccount): Promise<IAccount> {
        if (!data.owner) throw new Error('owner missing');
        const result = RsAccountSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const account = await Account.findOne(parsed);
        if (!account) throw new Error('account not found');
        return account;
    }

    async find(data: RmAccount, page: number = 1, limit: number = 10): Promise<PaginateResult<IAccount>> {
        const result = RmAccountSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const accounts = await Account.paginate(filter, { page, limit });
        return accounts;
    }

    async update(query: RsAccount, data: RsAccount): Promise<IAccount> {
        const account = await this.get(query);

        const result = RsAccountSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;
        await account.updateOne(parsed);

        return await this.get({ _id: account._id });
    }

    async delete(data: RsAccount): Promise<boolean> {
        const account = await this.get(data);
        await account.deleteOne();
        return true;
    }

    async size(data: RmAccount): Promise<number> {
        const result = RmAccountSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const total = await Account.countDocuments(parsed);
        return total;
    }
}
