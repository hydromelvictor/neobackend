import Admin, { IAdmin } from '../../models/holding/admin.models';
import { generateToken, verifyToken } from '../../helpers/token.helpers';
import { confirm, access } from '../../helpers/html.helpers';
import gmail from '../../helpers/gmail.helpers';
import { addToBlacklist, removeFromBlacklist } from '../../helpers/codecs.helpers';
import authenticated from '../authenticated.service';
import {
    ManyAdmin,
    SingleAdmin,
    SignAdmin,
    SignAdminSchema,
    SingleAdminSchema,
    ManyAdminSchema
} from './holding';
import { _XsAdmin, RsAdmin, XsAdmin } from '../../types/holding';



export default class Service {
    async filters (q: any): Promise<any> {
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
}

class AdminService {

    async filters(q: ManyAdmin): Promise<any> {
        const filter: any = {};

        if (q.letter) {
            const regex = new RegExp(`^${q.letter}`, 'i');
            (filter.$or.length ? filter.$or : []).concat([
                { firstname: regex },
                { lastname: regex }
            ])
        }

        if (q.name) {
            const regex = new RegExp(q.name, 'i');
            (filter.$or.length ? filter.$or : []).concat([
                { firstname: regex },
                { lastname: regex }
            ])
        }

        if (q.cni) filter.cni = new RegExp(q.cni, 'i');
        if (q.position) filter.position = new RegExp(q.position, 'i');
        if (q.online) filter.online = q.online;
        if (q.is_authenticated) filter.isAuthenticated = q.is_authenticated;
        if (q.staff) filter.staff = q.staff;

        return filter;
    }

    // Inscription par email - envoi du lien de confirmation
    async signUpEmailStep(data: SignAdmin): Promise<boolean> {
        const result = SignAdminSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        // Vérification si l'admin existe déjà
        const admin = await Admin.findOne({ email: parsed.email });
        if (admin) throw new Error(`${parsed.email} existe déjà`);

        // Génération du code de verification
        const token = await generateToken(parsed);
        if (!token) throw new Error('Token invalide');

        const code = generateCode(token);

        // Envoi de l'email de confirmation
        await gmail(
            parsed.email,
            'Vérification de compte',
            confirm(`${parsed.firstname} ${parsed.lastname}`, code)
        );

        return true;
    }

    // Finalisation de l'inscription - validation du token
    async signUpStepEnd(code: string): Promise<IAdmin> {
        const token = await verify(code);
        const decoded = await verifyToken(token);
        const admin = new Admin(decoded);
        await admin.save();

        return admin;
    }

    // Connexion par email - envoi du code de vérification
    async loginEmailStep(email: string): Promise<boolean> {
        if (!email) throw new Error('Email invalide');

        const admin = await Admin.findOne({ email });
        if (!admin) throw new Error(`${email} non reconnu par le système`);

        const code = generateCode(admin._id.toString());

        // Envoi du code de vérification par email
        await gmail(
            admin.email,
            'Vérification de compte',
            access(`${admin.firstname} ${admin.lastname}`, code)
        );
        return true;
    }

    // Finalisation de la connexion - validation du code
    async loginStepEnd(code: string): Promise<any> {
        const id = verify(code);
        if (!id) throw new Error('Code invalide');

        const admin = await Admin.findById(id);
        if (!admin) throw new Error('Utilisateur non trouvé pour ce code');

        return await authenticated(admin);
    }

    async get(data: SingleAdmin): Promise<IAdmin> {
        if (!data._id) throw new Error('identifiant manquant');

        const result = SingleAdminSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const admin = await Admin.findOne(parsed);
        if (!admin) throw new Error('admin non trouvé');

        return admin;
    }

    async find(data: ManyAdmin): Promise<IAdmin[]> {
        const result = ManyAdminSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const admins = await Admin.find(filter);
        return admins
    }

    async update(query: SingleAdmin, data: SingleAdmin): Promise<IAdmin> {
        const resultQuery = SignAdminSchema.safeParse(query);
        if (!resultQuery.success) throw new Error('invalid data');
        const parsedQuery = resultQuery.data;

        const resultData = SignAdminSchema.safeParse(data);
        if (!resultData.success) throw new Error('invalid data');
        const parsedData = resultData.data;

        const exist = await this.get(parsedQuery);
        const upsert = await Admin.updateOne(parsedQuery, parsedData);

        if (!upsert.modifiedCount) throw new Error('updated failed');

        return await this.get({ _id: exist._id });
    }

    async delete(data: SingleAdmin): Promise<boolean> {
        const result = SingleAdminSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const exist = await this.get(parsed);
        const rmsert = await exist.deleteOne();
        if (!rmsert.deletedCount) throw new Error('deleted failed');

        return true;
    }

    async size(data: ManyAdmin): Promise<number> {
        const result = ManyAdminSchema.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const total = await Admin.countDocuments(filter);
        return total;
    }
}


