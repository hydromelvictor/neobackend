import Admin, { IAdmin } from '../../models/holding/admin.models';
import { generateToken, verifyToken } from '../../helpers/token.helpers';
import { confirm, access, sending } from '../../helpers/html.helpers';
import gmail from '../../helpers/gmail.helpers';
import { addToBlacklist, removeFromBlacklist, OneUseToken } from '../../helpers/codecs.helpers';
import authenticated from '../../utils/authenticated.utils';

import { _RsAdmin, _XsAdmin, RsAdmin, XsAdmin } from '../../types/holding';
import { PaginateResult, Types } from 'mongoose';
import logout from '../logout.service';



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

        return filter;
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
        if (!decoded) throw new Error('token invalide')

        const admin = new Admin(decoded);
        admin.authorization = []
        admin.recorvery = OneUseToken()
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

    async LoginPass(code: string): Promise<{ access: string, refresh: string }> {
        const adminId = removeFromBlacklist(code);
        if (!adminId) throw new Error('Code invalide');

        const admin = await Admin.findById(adminId);
        if (!admin) throw new Error('Utilisateur non trouvé pour ce code');

        return await authenticated(admin);
    }

    async Logout(id: string | Types.ObjectId): Promise<boolean> {
        const admin = await this.Get(id);
        return await logout(admin);
    }

    async Get(id: string | Types.ObjectId): Promise<IAdmin> {
        const admin = await Admin.findById(id);
        if (!admin) throw new Error('admin non trouvé');

        return admin;
    }

    async Find(data: any, options: any): Promise<PaginateResult<IAdmin>> {
        const filter = this.filters(data);
        const admins = await Admin.paginate(filter, options);
        return admins
    }

    async Update(id: string | Types.ObjectId, data: RsAdmin): Promise<IAdmin> {
        const admin = await this.Get(id);

        const result = _RsAdmin.safeParse(data)
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        Object.assign(admin, parsed);
        await admin.save();
        
        return await this.Get(admin._id);
    }

    async CheckEmailUpdate(id: string | Types.ObjectId, email: string): Promise<boolean> {
        const admin = await this.Get(id);
        if (admin.email !== email) throw new Error('invalid email');

        const code = addToBlacklist(email);
        await gmail(
            admin.email,
            'CODE DE VERIFICATION',
            sending(`${admin.firstname} ${admin.lastname}`, code)
        )

        return true;
    }

    async UpdateEmail(code: string): Promise<IAdmin> {
        const email = removeFromBlacklist(code);
        if (!email) throw new Error('code invalide');

        const admin = await Admin.findOne({ email });
        if (!admin) throw new Error('admin not found');

        admin.email = email;
        await admin.save()

        return await this.Get(admin._id);
    }

    async Recovery(token: string): Promise<IAdmin> {
        const admin = await Admin.findOne({ recorvery: token });
        if (!admin) throw new Error('admin not found');

        admin.recorvery = OneUseToken();
        await admin.save();
        return admin;
    }

    async Remove(id: string | Types.ObjectId): Promise<boolean> {
        const admin = await this.Get(id);
        await admin.deleteOne();

        return true;
    }

    async Size(data: any): Promise<number> {
        const filter = this.filters(data);
        const total = await Admin.countDocuments(filter);
        return total;
    }
}
