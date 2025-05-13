import { generateCode } from "../../helpers/codecs.helpers";
import gmail from "../../helpers/gmail.helpers";
import Member, { IMember } from "../../models/holding/member.models";
import Org from "../../models/holding/org.models";
import authenticated from "../authenticated.service";
import {
    MemberRegister,
    MemberRegisterSchema,
    MemberLogin,
    MemberLoginSchema,
    SingleMember,
    SingleMemberSchema,
    ManyMember,
    ManyMemberSchema
} from "./holding";
import { confirm } from "../../helpers/html.helpers";
import { PaginateResult } from "mongoose";
import verify from "../verify.service";
import reset from "../reset.service";
import logout from "../logout.service";


class MemberService {

    async filters(q: ManyMember): Promise<any> {
        const filter: any = {};

        if (q.org) filter.org = q.org;
        if (q.name) {
            const regex = new RegExp(q.name, 'i');
            filter.$or = [
                { firstname: regex },
                { lastname: regex },
                { username: regex }
            ]
        }
        if (q.position) filter.position = new RegExp(q.position, 'i');
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

    async register(data: MemberRegister): Promise<boolean> {
        const result = MemberRegisterSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const exist = await Member.findOne({ username: parsed.username });
        if (exist) throw new Error(`${parsed.username} existe deja`);

        const member = new Member(parsed);
        await member.save();

        return true;
    }

    async login(data: MemberLogin): Promise<{ access: string, refresh: string }> {
        const result = MemberLoginSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const member = await Member.findOne({ username: parsed.username });
        if (!member) throw new Error('user not found');

        const check = await member.comparePassword(parsed.password);
        if (!check) throw new Error('password invalid');

        return await authenticated(member);
    }

    async forgot(email: string): Promise<void> {
        if (!email) throw new Error('email not found');

        const member = await Member.findOne({ email });
        if (!member) throw new Error('organisation with this email not found');

        const code = generateCode(member._id.toString());
        await gmail(
            email,
            'REINITIALISATION DE MOT DE PASSE',
            confirm(`${member.firstname} ${member.lastname}`, code)
        );

        return;
    }

    async verify(code: string): Promise<IMember> {
        const decoded: any = verify(code);
        if (!decoded) throw new Error('code invalid');

        return await this.get({ _id: decoded });
    }

    async reset(password: string, _id: any): Promise<boolean> {
        const member = await this.get({ _id });
        return reset(password, member);
    }

    async logout(_id: any): Promise<boolean> {
        const member = await this.get({ _id });
        return logout(member);
    }

    async get(data: SingleMember): Promise<IMember> {
        if (!data._id) throw new Error('_id missing');

        const result = SingleMemberSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const member = await Member.findOne(parsed);
        if (!member) throw new Error('member not found');

        return member;
    }

    async find(data: ManyMember, page: number = 1, limit: number = 10): Promise<PaginateResult<IMember>> {
        const result = ManyMemberSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const members = await Member.paginate(filter, { page, limit });
        return members;
    }

    async update(query: SingleMember, data: SingleMember): Promise<IMember> {
        const resultQuery = SingleMemberSchema.safeParse(query);
        if (!resultQuery.success) throw new Error('invalid data');
        const parsedQuery = resultQuery.data;

        const resultData = SingleMemberSchema.safeParse(data);
        if (!resultData.success) throw new Error('invalid data');
        const parsedData = resultData.data;

        const exist = await this.get(parsedQuery);
        const upsert = await Member.updateOne(parsedQuery, parsedData);

        if (!upsert.modifiedCount) throw new Error('updated failed');

        return await this.get({ _id: exist._id });
    }

    async delete(data: SingleMember): Promise<boolean> {
        const result = SingleMemberSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const exist = await this.get(parsed);
        const rmsert = await exist.deleteOne();

        if (!rmsert.deletedCount) throw new Error('deleted failed');

        return true;
    }

    async size(data: ManyMember): Promise<number> {
        const result = ManyMemberSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const total = await Member.countDocuments(filter);

        return total;
    }
}

export default MemberService;
