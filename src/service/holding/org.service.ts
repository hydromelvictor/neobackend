import { JwtPayload } from "jsonwebtoken";
import { generateToken, verifyToken } from "../../helpers/token.helpers";
import Org, { IOrg } from "../../models/holding/org.models";
import {
    SignUpDataOrgLoading,
    OrgRegisterSchema,
    SignUpDataOrgRegister,
    OrgLoadingSchema,
    SingleOrg,
    SingleOrgSchema,
    ManyOrg,
    ManyOrgSchema
} from "./holding";
import { generateCode } from "../../helpers/codecs.helpers";
import gmail from "../../helpers/gmail.helpers";
import { confirm } from "../../helpers/html.helpers";
import verify from "../verify.service";
import { PaginateResult } from "mongoose";
import AccountService from "../market/account.service";
import { IAccount } from "../../models/market/account.models";


class OrgService {
    private account: AccountService;

    constructor() {
        this.account = new AccountService();
    }

    async filters(q: ManyOrg): Promise<any> {
        const filter: any = {};

        if (q.reason) filter.reason = new RegExp(q.reason, 'i');
        if (q.mentor) filter.mentor = q.mentor;
        if (q.social) filter.social = q.social;
        if (q.country) filter.country = new RegExp(q.country, 'i');
        if (q.state) filter.state = new RegExp(q.state);
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
        if (q.sector) filter.sector = q.sector;
        if (q.service) filter.service = new RegExp(q.service, 'i');
        if (q.area) filter.area = new RegExp(q.area, 'i');
        if (q.before || q.after) {
            filter.createdAt = {};
            if (q.before) {
                filter.createdAt.$lte = new Date(q.before);
            }
            if (q.after) {
                filter.createdAt.$gte = new Date(q.after);
            }
        }

        return filter;
    }

    async register(data: SignUpDataOrgRegister): Promise<string> {
        const result = OrgRegisterSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const exist = await Org.findOne({ reason: parsed.reason });
        if (exist) throw new Error(`${parsed.reason} exists deja`);

        const token = await generateToken(parsed);
        if (!token) throw new Error('erreur token');

        return token;
    }

    async loading(data: SignUpDataOrgLoading, token: string): Promise<boolean> {
        const result = OrgLoadingSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const exist = await Org.findOne({ email: parsed.email });
        if (!exist) throw new Error(`${parsed.email} exist deja`);

        const decoded = await verifyToken(token) as JwtPayload;
        if (!decoded) throw new Error('token invalid');

        const newToken = await generateToken({ ...parsed, ...decoded });
        if (!newToken) throw new Error('generate token failed');

        const code = generateCode(newToken);

        await gmail(
            parsed.email,
            'Verification de compte',
            confirm(decoded.reason, code)
        );

        return true;
    }

    async verify(code: string): Promise<{ org: IOrg, acc: IAccount }> {
        const token = await verify(code);
        const decoded = await verifyToken(token);
        if (!decoded) throw new Error('code invalid');

        const org = new Org(decoded);
        await org.save();

        const acc = await this.account.create({ owner: org._id });
        return { org, acc };
    }

    async get(data: SingleOrg): Promise<IOrg> {
        if (!data._id) throw new Error('_id missing');

        const result = SingleOrgSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const org = await Org.findOne(parsed);
        if (!org) throw new Error('org not found');

        return org;
    }

    async find(data: ManyOrg, page: number = 1, limit: number = 10): Promise<PaginateResult<IOrg>> {
        const result = ManyOrgSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const orgs = await Org.paginate(filter, { page, limit });
        return orgs;
    }

    async update(query: SingleOrg, data: SingleOrg): Promise<IOrg> {
        const org = await this.get(query);

        const result = SingleOrgSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;
        await org.updateOne(parsed);

        return await this.get({ _id: org._id });
    }

    async delete(data: SingleOrg): Promise<boolean> {
        const org = await this.get(data);
        await org.deleteOne();
        return true;
    }

    async size(data: ManyOrg): Promise<number> {
        const result = ManyOrgSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const total = await Org.countDocuments(filter);

        return total;
    }
}

export default OrgService;