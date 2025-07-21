import { Request, Response } from 'express';
import Admin from '../../models/users/admin.models';
import { JsonResponse } from '../../types/api';
import { addToBlacklist, OneUseToken, validateAndUseCode } from '../../helpers/codecs.helpers';
import gmail from '../../helpers/gmail.helpers';
import { emailToSign } from '../../helpers/html.helpers';
import { authenticate } from './sign.controllers';


export default class AdminController {
    public static filters = (q: any): any => {
        const filter: any = {};

        if (q.name) {
            const regex = { $regex: q.name, $options: 'i' };
            filter.$or = [
                { firstname: regex },
                { lastname: regex }
            ];
        }
        if (q.online) filter.online = q.online === 'true';
        if (q.auth) filter.isAuthenticated = q.auth === 'true' || q.auth === true;
        if (q.after) {
            const now = new Date(q.after);
            now.setHours(0, 0, 0, 0);
            filter.createdAt = { $gte: now };
        }
        if (q.before) {
            const now = new Date(q.before);
            now.setHours(0, 0, 0, 0);
            filter.createdAt = { $lte: now };
        }

        return filter;
    }

    public static async signUp(req: Request, res: Response) {
        try {
            const admin = new Admin(req.body);
            admin.recovery = OneUseToken();
            await admin.save();

            const response: JsonResponse = {
                success: true,
                message: 'Admin enregistré avec succès',
                data: admin
            };

            res.status(201).json(response);
        } catch (error: any) {
            console.error('Erreur lors de l\'enregistrement de l\'admin:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            res.status(500).json(response);
        }
    }

    public static async SignEmail(req: Request, res: Response) {
        try {
            const admin = await Admin.findOne({ email: req.body.email });
            if (!admin) throw new Error('Admin non trouvé');

            const otp = addToBlacklist(admin._id.toString());
            await gmail(admin.email, 'VERIFICATION DE MAIL', emailToSign(`${admin.firstname} ${admin.lastname}`, otp));

            const response: JsonResponse = {
                success: true,
                message: 'eamil envoyé avec success'
            }
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la récupération de l\'admin')
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du server',
                error: error.message
            }
            res.status(500).json(response);
        }
    }

    public static async loadin(req: Request, res: Response) {
        try {
            const valid = validateAndUseCode(req.body.otp);
            if (!valid.success) throw new Error('Invalid OTP');

            const admin = await Admin.findById(valid.username);
            if (!admin) throw new Error('Admin non trouvé');

            const response = await authenticate(admin);

            res.status(201).json(response);
        } catch (error: any) {
            console.error('Erreur lors de l\'enregistrement de l\'email')
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du server',
                error: error.message
            }
            res.status(500).json(response);
        }
    }

    public static async retrieve(req: Request, res: Response) {
        try {
            const admin = await Admin.findById(req.params.id);
            if (!admin) throw new Error('Admin non trouvé');

            const response: JsonResponse = {
                success: true,
                message: 'Admin trouvé avec succès',
                data: admin
            };

            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la récupération de l\'admin:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne',
                error: error.message
            };

            res.status(500).json(response);
        }
    }

    public static async list(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const options = { page: parseInt(page as string), limit: parseInt(limit as string), sort: { createdAt: -1 } };
            const admins = await Admin.paginate(AdminController.filters(req.query), options);

            const response: JsonResponse = {
                success: true,
                message: 'Admins trouvés avec succès',
                data: admins
            };

            res.status(200).json(response);
        } catch (err: any) {
            console.error('Erreur lors de la récupération des admins:', err);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne',
                error: err.message
            };

            res.status(500).json(response);
        }
    }

    public static async update(req: Request, res: Response) {
        try {
            const admin = await Admin.findById(req.params.id);
            if (!admin) throw new Error('Admin non trouvé');

            Object.assign(admin, req.body);
            await admin.save();

            const response: JsonResponse = {
                success: true,
                message: 'Admin mis à jour avec succès',
                data: admin
            };

            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la mise à jour de l\'admin:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            res.status(500).json(response);
        }
    }

    public static async delete(req: Request, res: Response) {
        try {
            const admin = await Admin.findById(req.params.id);
            if (!admin) throw new Error('Admin non trouvé');

            await admin.deleteOne();
            const response: JsonResponse = {
                success: true,
                message: 'Admin supprimé avec succès'
            }

            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la suppression de l\'admin:', error);
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            }
            res.status(500).json(response);
        }
    }

    public static async count(req: Request, res: Response) {
        try {
            const count = await Admin.countDocuments(this.filters(req.query));
            const response: JsonResponse = {
                success: true,
                message: 'Admin trouvés avec succès',
                data: count
            }
            res.status(200).json(response);
        } catch (error: any) {
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            }
            res.status(500).json(response);
        }
    }
}
