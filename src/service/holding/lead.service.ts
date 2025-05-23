import { PaginateResult, Types } from "mongoose";
import Lead, { ILead } from "../../models/holding/lead.models";
import { _XsLead, XsLead } from "../../types/holding";
import authenticated from "../../utils/authenticated.utils";
import logout from "../logout.service";


export default class Service {
    private filters(q: any): any {
        const filter: any = {};

        if (q.name) {
            const regex = { $regex: q.name, $options: 'i' };
            (filter.$or.length ? filter.$or : []).concat([
                { firstname: regex },
                { lastname: regex }
            ])
        }

        if (q.letter) {
            const regex = { $regex: `^${q.letter}`, $options: 'i' };
            (filter.$or.length ? filter.$or : []).concat([
                { firstname: regex },
                { lastname: regex }
            ])
        }

        if (q.address) filter.address = { $regex: q.address, $options: 'i' };

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

        if (q.online) filter.online = q.online;
        if (q.is_authenticated) filter.isAuthenticated = q.is_authenticated;
        if (q.staff) filter.staff = q.staff;

        return filter;
    }

    async Create(): Promise<ILead> {
        const lead = new Lead();
        lead.online = true;
        lead.isAuthenticated = true;
        await lead.save();
        return lead;
    }

    async Login(id: string | Types.ObjectId): Promise<{ access: string, refresh: string}> {
        const lead = await this.Get(id);
        return await authenticated(lead);
    }

    async Get(id: string | Types.ObjectId): Promise<ILead> {
        const lead = await Lead.findById(id);
        if (!lead) throw new Error('lead not found');

        return lead;
    }

    async Find(data: any, options: any): Promise<PaginateResult<ILead>> {
        const filter = this.filters(data);
        const leads = await Lead.paginate(filter, options);
        return leads;
    }

    async Update(id: string | Types.ObjectId, data: XsLead): Promise<ILead> {
        const lead = await this.Get(id);
        const result = _XsLead.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        Object.assign(lead, parsed)
        await lead.save();
        return await this.Get(lead._id);
    }

    async Remove(id: string | Types.ObjectId): Promise<boolean> {
        const lead = await this.Get(id);
        await lead.deleteOne();

        return true;
    }

    async Size(data: any): Promise<number> {
        const filter = this.filters(data);
        const total = await Lead.countDocuments(filter);
        return total;
    }
}
