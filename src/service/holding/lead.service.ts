import { PaginateResult } from "mongoose";
import Lead, { ILead } from "../../models/holding/lead.models";
import { ManyLead, ManyLeadSchema, SingleLead, SingleLeadSchema } from "./holding";

export default class LeadService {

    async filters(q: ManyLead): Promise<any> {
        const filter: any = {};
        
        if (q.name) {
            const regex = new RegExp(q.name, 'i');
            filter.$or = [
                { firstname: regex },
                { lastname: regex }
            ]
        }
        if (q.address) filter.address = new RegExp(q.address, 'i');
        if (q.online) filter.online = q.online;
        if (q.is_authenticated) filter.isAuthenticated = q.is_authenticated;
        if (q.staff) filter.staff = q.staff;
        if (q.before || q.after) {
            filter.createdAt = {};
            if (q.before) {
                filter.createdAt.$lt = new Date(q.before);
            }
            if (q.after) {
                filter.createdAt.$gt = new Date(q.after);
            }
        }
        return filter;
    }

    async fakeLead(): Promise<ILead> {
        const lead = new Lead();
        await lead.save();
        return lead;
    }

    async get(data: SingleLead): Promise<ILead> {
        if (!data._id || !data.phone) throw new Error('identifier missing');

        const result = SingleLeadSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const lead = await Lead.findOne(parsed);
        if (!lead) throw new Error('lead not found');

        return lead;
    }

    async find(data: ManyLead, page: number = 1, limit: number = 10): Promise<PaginateResult<ILead>> {
        const result = ManyLeadSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const leads = await Lead.paginate(filter, { page, limit });

        return leads;
    }

    async update(query: SingleLead, data: SingleLead): Promise<ILead> {
        const resultQuery = SingleLeadSchema.safeParse(query);
        if (!resultQuery.success) throw new Error('invalid data');
        const parsedQuery = resultQuery.data;

        const resultData = SingleLeadSchema.safeParse(data);
        if (!resultData.success) throw new Error('invalid data');
        const parsedData = resultData.data;

        const exist = await this.get(parsedQuery);
        const upsert = await Lead.updateOne(parsedQuery, parsedData);

        if (!upsert.modifiedCount) throw new Error('update failed');

        return await this.get({ _id: exist._id });
    }

    async delete(data: SingleLead): Promise<boolean> {
        const result = SingleLeadSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const exist = await this.get(parsed);
        const rmsert = await exist.deleteOne();

        if (!rmsert.deletedCount) throw new Error('deleted failed');

        return true;
    }

    async size(data: ManyLead): Promise<number> {
        const result = ManyLeadSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const total = await Lead.countDocuments(filter);

        return total;
    }
}