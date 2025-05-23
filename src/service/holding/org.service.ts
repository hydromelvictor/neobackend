import { PaginateResult, Types } from "mongoose";
import { addToBlacklist, removeFromBlacklist } from "../../helpers/codecs.helpers";
import gmail from "../../helpers/gmail.helpers";
import { confirm } from "../../helpers/html.helpers";
import { generateToken, verifyToken } from "../../helpers/token.helpers";
import Org, { IOrg } from "../../models/holding/org.models";
import { _RsOrg, _XsOrg, RsOrg, XsOrg } from "../../types/holding";


export default class Service {
    private filters(q: any): any {
        const filter: any = {};

        if (q.reason) filter.reason = { $regex: q.reason, $options: 'i' };
        if (q.mentor) filter.mentor = q.mentor;
        if (q.social) filter.social = { $regex: q.social, $options: 'i' };
        if (q.sector) filter.sector = q.sector;
        if (q.zone) {
            const regex = { $regex: q.zone, $options: 'i' };
            filter.$or = [
                { country: regex },
                { state: regex }
            ]
        }
        if (q.lon && q.lat) {
            filter.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [q.lon, q.lat] // Longitude d'abord
                    },
                    $maxDistance: 100000 // 100 km en mètres
                }
            };
        }
        if (q.service) filter.service = { $regex: q.service, $options: 'i' };
        if (q.area) filter.area = { $regex: q.area, $options: 'i' };
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

    async SignUpLoading(data: XsOrg): Promise<boolean> {
        const result = _XsOrg.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const exist = await Org.findOne({ $or: [
            { reason: parsed.reason },
            { phone: parsed.phone },
            { email: parsed.email }
        ]})
        if (exist) throw new Error(`${parsed.reason}, ${parsed.phone} ou ${parsed.email} exist deja`);

        const token = await generateToken(parsed);
        if (!token) throw new Error('erreur token');

        const code = addToBlacklist(token);

        await gmail(
            parsed.email,
            'Verification de compte',
            confirm(parsed.reason, code)
        )

        return true;
    }

    async Register(code: string): Promise<IOrg> {
        const token = removeFromBlacklist(code);
        if (!token) throw new Error('code invalide');

        const decoded = await verifyToken(token);
        if (!decoded) throw new Error('invalide token');

        const org = new Org(decoded);
        await org.save();

        return org;
    }

    async Get(id: string | Types.ObjectId): Promise<IOrg> {
        const org = await Org.findById(id);
        if (!org) throw new Error('org not found');

        return org;
    }

    async Find(data: any, options: any): Promise<PaginateResult<IOrg>> {
        const filter = this.filters(data);
        const orgs = await Org.paginate(filter, options);
        return orgs;
    }

    async Update(id: string | Types.ObjectId, data: RsOrg): Promise<IOrg> {
        const org = await this.Get(id);
        const result = _RsOrg.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        Object.assign(org, parsed);
        await org.save();

        return await this.Get(org._id);
    }

    async Remove(id: string | Types.ObjectId): Promise<boolean> {
        const org = await this.Get(id);
        await org.deleteOne();

        return true;
    }

    async Size(data: any): Promise<number> {
        const filter = this.filters(data);

        const total = Org.countDocuments(filter);
        return total;
    }
}
