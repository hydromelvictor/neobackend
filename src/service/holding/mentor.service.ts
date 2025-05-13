import Mentor, { IMentor } from "../../models/holding/mentor.models";
import { generateToken, verifyToken } from '../../helpers/token.helpers';
import { confirm } from '../../helpers/html.helpers';
import { generateCode, shortUUID } from '../../helpers/codecs.helpers';
import gmail from '../../helpers/gmail.helpers';
import { ManyMentor, ManyMentorSchema, SignMentor, SignMentorSchema, SingleMentor, SingleMentorSchema } from "./holding";
import authenticated from "../authenticated.service";
import checked from "../verify.service";
import { PaginateResult } from "mongoose";
import AccountService from "../market/account.service";


class MentorService {
    private account: AccountService;

    constructor() {
        this.account = new AccountService();
    }

    async filters(q: ManyMentor): Promise<any> {
        const filter: any = {}

        if (q.letter) {
            const regex = new RegExp(`^${q.letter}`, 'i');
            filter.$or = [
                { firstname: regex },
                { lastname: regex }
            ]
        }

        if (q.name) {
            const regex = new RegExp(q.name, 'i');
            (filter.$or.length ? filter.$or : []).concat([
                { firstname: regex },
                { lastname: regex }
            ])
        }

        if (q.state) {
            const regex = new RegExp(q.state, 'i');
            (filter.$or.length ? filter.$or : []).concat([
                { country: regex },
                { city: regex }
            ])
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

    async signUpEmailStep(data: SignMentor): Promise<boolean> {
        const result = SignMentorSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const mentor = await Mentor.findOne({ email: parsed.email });
        if (mentor) throw new Error(`${parsed.email} existe deja`);

        const token = await generateToken(parsed);
        if (!token) throw new Error('Token invalide');

        const code = generateCode(token);
        await gmail(
            parsed.email,
            'Vérification de compte',
            confirm(`${parsed.firstname} ${parsed.lastname}`, `${code}`)
        );

        return true;
    }

    async signUpVerifyStep(code: string): Promise<string> {
        const token = await checked(code);
        const decoded = await verifyToken(token);
        if (!decoded) throw new Error('code invalid');

        const mentor = new Mentor(decoded);
        await mentor.save();

        await this.account.create({ owner: mentor._id });

        const newtoken = await generateToken({ _id: mentor._id });
        if (!newtoken) throw new Error('generate token failed');

        return newtoken;
    }

    async signUpPasswordStep(password: string, decoded: any): Promise<boolean> {
        if (!password || !decoded) throw new Error('data invalid');

        const mentor = await Mentor.findById(decoded);
        if (!mentor) throw new Error('mentor not found');

        mentor.password = password;
        mentor.codecs = shortUUID();
        await mentor.save();

        return true;
    }

    async login(email: string, password: string): Promise<any> {
        if (!email || !password) throw new Error('champs manquants');

        const mentor = await Mentor.findOne({ email });
        if (!mentor) throw new Error('mentor not found');

        const check = await mentor.comparePassword(password);
        if (!check) throw new Error('password invalid');

        return await authenticated(mentor);
    }

    async get(data: SingleMentor): Promise<IMentor> {
        const result = SingleMentorSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const mentor = await Mentor.findOne(parsed);
        if (!mentor) throw new Error('mentor non trouve');

        return mentor;
    }

    async find(data: ManyMentor, page: number = 1, limit: number = 10): Promise<PaginateResult<IMentor>> {
        const result = ManyMentorSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const mentors = await Mentor.paginate(filter, { page, limit });
        return mentors;
    }

    async update(query: SingleMentor, data: SingleMentor): Promise<IMentor> {
        const resultQuery = SingleMentorSchema.safeParse(query);
        if (!resultQuery.success) throw new Error('invalid data');
        const parsedQuery = resultQuery.data;

        const resultData = SingleMentorSchema.safeParse(data);
        if (!resultData.success) throw new Error('invalid data');
        const parsedData = resultData.data;

        const exist = await this.get(parsedQuery);
        const upsert = await Mentor.updateOne(parsedQuery, parsedData);

        if (!upsert.modifiedCount) throw new Error('updated failed');

        return await this.get({ _id: exist._id });
    }

    async delete(data: SingleMentor): Promise<boolean> {
        const result = SingleMentorSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const exist = await this.get(parsed);
        const rmsert = await exist.deleteOne();

        if (!rmsert.deletedCount) throw new Error('deleted failed');

        return true;
    }

    async count(data: ManyMentor): Promise<number> {
        const result = ManyMentorSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const total = await Mentor.countDocuments(filter);
        return total;
    }
}

export default MentorService;
