import { PaginateResult, Types } from "mongoose";
import { addToBlacklist, OneUseToken, removeFromBlacklist } from "../../helpers/codecs.helpers";
import gmail from "../../helpers/gmail.helpers";
import { confirm } from "../../helpers/html.helpers";
import { generateToken, verifyToken } from "../../helpers/token.helpers";
import Mentor, { IMentor } from "../../models/holding/mentor.models";
import { _RsMentor, _XsMentor, RsMentor, XsMentor } from "../../types/holding";
import authenticated from "../../utils/authenticated.utils";

export default class Service {
    private filters(q: any): any {
        const filter: any = {};

        if (q.letter) {
            const regex = { $regex: q.letter, $options: 'i' };
            (filter.$or.length ? filter.$or : []).concat([
                { firstname: regex },
                { lastname: regex }
            ])
        }
        if (q.name) {
            const regex = { $regex: q.name, $options: 'i' };
            (filter.$or.length ? filter.$or : []).concat([
                { firstname: regex },
                { lastname: regex }
            ])
        }
        if (q.zone) {
            const regex = { $regex: q.zone, $options: 'i' };
            (filter.$or.length ? filter.$or : []).concat([
                { country: regex },
                { city: regex }
            ])
        }
        if (q.position) filter.position = { $regex: q.position, $options: 'i' };
        if (q.min) filter.referClick.$gte = q.min;
        if (q.max) filter.referClick.$lte = q.max;
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

    async SignUpToEmail(data: XsMentor): Promise<boolean> {
        const result = _XsMentor.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const mentor = await Mentor.findOne({ email: parsed.email });
        if (mentor) throw new Error(`${parsed.email} existe deja`);

        const token = await generateToken(parsed);
        if (!token) throw new Error('Token invalide');

        const code = addToBlacklist(token);
        await gmail(
            parsed.email,
            'Vérification de compte',
            confirm(`${parsed.firstname} ${parsed.lastname}`, `${code}`)
        )

        return true;
    }

    async Register(code: string): Promise<string | Types.ObjectId> {
        const token = removeFromBlacklist(code);
        if (!token) throw new Error('code invalid');

        const decoded = await verifyToken(token);
        if (!decoded) throw new Error('code invalid');

        const mentor = new Mentor(decoded);
        await mentor.save();

        return mentor._id;
    }

    async AddPassword(id: string | Types.ObjectId, password: string): Promise<boolean> {
        const mentor = await this.Get(id);
        mentor.password = password;
        mentor.codecs = OneUseToken();
        await mentor.save();

        return true;
    }

    async Login(credentials: { email: string, password: string }): Promise<{ access: string, refresh: string }> {
        if (!('email' in credentials) || !('password' in credentials))
            throw new Error('email ou password manquant');

        const mentor = await Mentor.findOne({ email: credentials.email });
        if (!mentor) throw new Error('mentor not found');

        const check = await mentor.comparePassword(credentials.password);
        if (!check) throw new Error('password invalid');

        return await authenticated(mentor);
    }

    async Get(id: string | Types.ObjectId): Promise<IMentor> {
        const mentor = await Mentor.findById(id);
        if (!mentor) throw new Error('mentor not found');

        return mentor;
    }

    async Find(data: any, options: any): Promise<PaginateResult<IMentor>> {
        const filter = this.filters(data);
        const mentors = await Mentor.paginate(filter, options);
        return mentors;
    }

    async Update(id: string | Types.ObjectId, data: RsMentor): Promise<IMentor> {
        const mentor = await this.Get(id);
        
        const result = _RsMentor.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        Object.assign(mentor, parsed);
        await mentor.save();
        return await this.Get(mentor._id);
    }

    async Remove(id: string | Types.ObjectId): Promise<boolean> {
        const mentor = await this.Get(id);
        await mentor.deleteOne()

        return true;
    }

    async Size(data: any): Promise<number> {
        const filter = this.filters(data);
        const total = await Mentor.countDocuments(filter);
        return total;
    }
}
