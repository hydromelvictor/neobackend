import Ia, { IAs } from "../../models/users/neo.models";
import { _RsIa, _XsIa, RsIa, XsIa } from "../../types/ia";
import { PaginateResult, Types } from "mongoose";


export default class Service {
    private filters(q: any): any {
        const filter: any = {};

        if (q.org) filter.org = q.org;
        if (q.fullname) filter.fullname = { $regex: q.fullname, $options: 'i' };
        if (q.resp) filter.responsability = { $regex: q.resp, $options: 'i' };
        if (q.sex) filter.sex = { $regex: q.sex, $options: 'i' };
        if (q.action) {
            const action = { $regex: q.role, $options: 'i' };
            filter.$or = [
                { mission: action },
                { context: action },
                { task: { $in: action } },
                { tools: { $in: action } }
            ]
        }
        if (q.resource) filter.resources = { $in: q.resource };
        if (q.version) filter.version = { $regex: q.version, $option: 'i' };
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

    async Create(data: XsIa): Promise<IAs> {
        const result = _XsIa.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const agent = new Ia(parsed);
        await agent.save();

        return agent;
    }

    async Get(id: string | Types.ObjectId): Promise<IAs> {
        const agent = await Ia.findById(id);
        if (!agent) throw new Error('agent not found');

        return agent;
    }

    async Find(data: any, options: any): Promise<PaginateResult<IAs>> {
        const filter = this.filters(data);
        const agents = await Ia.paginate(filter, options);

        return agents;
    }

    async Update(id: string | Types.ObjectId, data: RsIa): Promise<IAs> {
        const agent = await this.Get(id);
        const result = _RsIa.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        Object.assign(agent, parsed);
        await agent.save();

        return await this.Get(agent._id);
    }

    async Remove(id: string | Types.ObjectId): Promise<boolean> {
        const agent = await this.Get(id);
        agent.deleteOne();

        return true;
    }

    async Size(data: any): Promise<number> {
        const filter = this.filters(data);
        const total = Ia.countDocuments(filter);

        return total;
    }
}
