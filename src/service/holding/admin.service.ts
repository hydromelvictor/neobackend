import Admin, { IAdmin } from '../../models/holding/admin.models';
import { generateToken, verifyToken } from '../../helpers/token.helpers';
import { confirm, access } from '../../helpers/html.helpers';
import gmail from '../../helpers/gmail.helpers';
import { addToBlacklist, removeFromBlacklist } from '../../helpers/codecs.helpers';
import authenticated from '../authenticated.service';

import { _RsAdmin, _XsAdmin, RsAdmin, XsAdmin } from '../../types/holding';
import { PaginateResult } from 'mongoose';



export default class Service {
    private async filters (q: any): Promise<any> {
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
        

        if (q.position) filter.position = { $regex: q.position, $options: 'i' };
        if (q.online) filter.online = q.online;
        if (q.is_authenticated) filter.isAuthenticated = q.is_authenticated;
        if (q.staff) filter.staff = q.staff;
    }

    async SignUpLoadData(data: XsAdmin): Promise<boolean> {
        const result = _XsAdmin.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const admin = await Admin.findOne({ email: parsed.email });
        if (admin) throw new Error(`${parsed.email} existe déjà`);

        const token = await generateToken(parsed);
        if (!token) throw new Error('Token invalide');

        const code = addToBlacklist(token);
        await gmail(
            parsed.email,
            'Vérification de compte',
            confirm(`${parsed.firstname} ${parsed.lastname}`, code)
        );

        return true;
    }

    async RegisterAdmin(code: string): Promise<IAdmin> {
        const token = removeFromBlacklist(code);
        if (!token) throw new Error('token invalid');

        const decoded = await verifyToken(token);

        const admin = new Admin(decoded);
        admin.authorization = []
        await admin.save();

        return admin;
    }

    async LoginByEmail(email: string): Promise<boolean> {
        if (!email) throw new Error('Email invalide');
        
        const admin = await Admin.findOne({ email });
        if (!admin) throw new Error(`${email} non reconnu par le système`);

        const code = addToBlacklist(admin._id.toString())
        await gmail(
            admin.email,
            'Vérification de compte',
            access(`${admin.firstname} ${admin.lastname}`, code)
        );

        return true;
    }

    async LoginPass(code: string): Promise<{ access: string, refresh: string}> {
        const adminId = removeFromBlacklist(code);
        if (!adminId) throw new Error('Code invalide');

        const admin = await Admin.findById(adminId);
        if (!admin) throw new Error('Utilisateur non trouvé pour ce code');

        return await authenticated(admin);
    }

    async get(data: RsAdmin): Promise<IAdmin> {
        const result = _RsAdmin.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const requiredFiedls = ['_id']
        for (const field of requiredFiedls)
            if (!(field in parsed)) throw new Error(`${field} manquant`);

        const admin = await Admin.findOne(parsed);
        if (!admin) throw new Error('admin non trouvé');

        return admin;
    }

    async find(data: any, options: any): Promise<PaginateResult<IAdmin>> {
        const filter = await this.filters(data);

        const result = _RsAdmin.safeParse(filter);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const admins = await Admin.paginate(parsed, options);
        return admins
    }

    async update(query: RsAdmin, data: RsAdmin): Promise<IAdmin> {
        const admin = await this.get(query);

        const result = _RsAdmin.safeParse(data)
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        await admin.updateOne(parsed);
        return await this.get({ _id: admin._id });
    }

    async remove(data: RsAdmin): Promise<boolean> {
        const admin = await this.get(data);
        await admin.deleteOne();

        return true;
    }

    async size(data: any): Promise<number> {
        const filter = await this.filters(data);

        const result = _RsAdmin.safeParse(filter);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const total = await Admin.countDocuments(parsed);
        return total;
    }
}
