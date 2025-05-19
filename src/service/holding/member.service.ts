import { PaginateResult, Types } from "mongoose";
import Member, { IMember } from "../../models/holding/member.models";
import { _XsMember, RsMember, XsMember } from "../../types/holding";
import authenticated from "../../utils/authenticated.utils";
import reset from "../reset.service";
import logout from "../logout.service";


export default class Service {
    private filters(q: any): any {
        const filter: any = {};

        if (q.org) filter.org = q.org;
        if (q.name) {
            const regex = { $regex: q.name, $options: 'i' };
            filter.$or = [
                { firstname: regex },
                { lastname: regex },
                { username: regex }
            ]
        }
        if (q.position) filter.position = { $regex: q.position, $options: 'i' };
        if (q.online) filter.online = q.online;
        if (q.is_authenticated) filter.isAuthenticated = q.is_authenticated;
        if (q.staff) filter.staff = q.staff;
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

    async Create(data: XsMember): Promise<IMember> {
        const result = _XsMember.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const exist = await Member.findOne({ email: parsed.email });
        if (exist) throw new Error(`${parsed.email} existe deja dans le systeme`);

        const member = new Member(parsed);
        await member.save();
        return member;
    }

    async Login(credentials: { email: string, password: string }): Promise<{ access: string, refresh: string }> {
        if (!('email' in credentials) || !('password' in credentials))
            throw new Error('email ou password manquant');

        const member = await Member.findOne({ email: credentials.email });
        if (!member) throw new Error('member not found');

        const check = await member.comparePassword(credentials.password);
        if (!check) throw new Error('password invalide');

        return await authenticated(member);
    }

    async Logout(id: string | Types.ObjectId): Promise<boolean> {
        const member = await this.Get(id);
        return await logout(member);
    }

    async ResetPassword(id: string | Types.ObjectId, password: string): Promise<boolean> {
        const member = await this.Get(id);
        return await reset(password, member);
    }

    async Get(id: string | Types.ObjectId): Promise<IMember> {
        const member = await Member.findById(id);
        if (!member) throw new Error('member not found');

        return member;
    }

    async Find(data: any, options: any): Promise<PaginateResult<IMember>> {
        const filter = this.filters(data);
        const members = await Member.paginate(data, options);
        return members;
    }

    async Update(id: string | Types.ObjectId, data: RsMember): Promise<IMember> {
        const member = await this.Get(id);

        const result = _XsMember.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        Object.assign(member, parsed)
        await member.save();
        
        return await this.Get(member._id);
    }

    async Remove(id: string | Types.ObjectId): Promise<boolean> {
        const member = await this.Get(id);
        await member.deleteOne();

        return true;
    }

    async Size(data: any): Promise<number> {
        const filter = this.filters(data);
        const total = await Member.countDocuments(filter);
        return total;
    }
}
