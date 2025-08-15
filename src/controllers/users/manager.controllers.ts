import { Request, Response } from 'express';
import Manager from '../../models/users/manager.model';
import { addToBlacklist, validateAndUseCode } from '../../helpers/codecs.helpers';
import { generateToken, verifyToken } from '../../helpers/token.helpers';
import gmail from '../../helpers/gmail.helpers';
import { emailToSign } from '../../helpers/html.helpers';
import { JsonResponse } from '../../types/api';
import Account from '../../models/marketing/account.models';


export default class ManagerController {
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
        if (q.auth) filter.isAuthenticated = q.auth === 'true';
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

    public static async load(req: Request, res: Response): Promise<void> {
        try {
            const manager = await Manager.findOne({
                $or: [
                    { email: req.body.email },
                    { phone: req.body.phone }
                ]
            });
            if (manager) throw new Error('Manager with the same email or phone already exists');

            const token = generateToken(req.body);
            if (!token.success) throw new Error(`${token.error}`);

            const otp = addToBlacklist(token.data as string);
            await gmail(req.body.email, 'VERIFICATION DE MAIL', emailToSign(`${req.body.firstname} ${req.body.lastname}`, otp));

            const response: JsonResponse = {
                success: true,
                message: 'email envoyé avec success'
            }
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            res.status(500).json(response);
        }
    }

    public static async signUp(req: Request, res: Response): Promise<void> {
        try {
            const valid = validateAndUseCode(req.body.otp);
            if (!valid.success) throw new Error('Invalid OTP');

            const result = verifyToken(valid.username as string);
            if (!result.success) throw new Error(`${result.error}`);

            const manager = new Manager(result.data);
            await manager.save();

            // creation de wallet
            Account.create({ owner: manager._id });

            const response: JsonResponse = {
                success: true,
                message: 'Erreur interne du serveur',
                data: manager
            };

            res.status(201).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            res.status(500).json(response);
        }
    }

    public static async password(req: Request, res: Response): Promise<void> {
        try {
            const manager = await Manager.findById(req.params.id);
            if (!manager) throw new Error('Manager not found');

            manager.password = req.body.password;
            manager.online = false;
            manager.isAuthenticated = false;
            manager.disconnected = `hors ligne depuis le ${new Date().toISOString().split('T')[0]}`;
            await manager.save();

            const response: JsonResponse = {
                success: true,
                message: 'password definis avec success'
            }

            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            res.status(500).json(response);
        }
    }

    public static async retrieve(req: Request, res: Response): Promise<void> {
        try {
            const manager = await Manager.findById(req.params.id);
            if (!manager) throw new Error('Manager not found');

            const response: JsonResponse = {
                success: true,
                message: 'manager envoyé avec success',
                data: manager
            }
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            res.status(500).json(response);
        }
    }

    public static async list(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 10 } = req.query;

            const options = { page: parseInt(page as string), limit: parseInt(limit as string), sort: { createdAt: -1 } };
            const managers = await Manager.paginate(ManagerController.filters(req.query), options);

            const response: JsonResponse = {
                success: true,
                message: 'list managers envoyé avec success',
                data: managers
            }
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            res.status(500).json(response);
        }
    }

    public static async update(req: Request, res: Response): Promise<void> {
        try {
            const manager = await Manager.findById(req.params.id);
            if (!manager) throw new Error('Manager not found');

            const email = req.body.email;
            const phone = req.body.phone;
            const exist = await Manager.findOne({
                $or: [
                    email ? { email } : {},
                    phone ? { phone } : {}
                ]
            })
            if (exist?._id.toString() !== manager._id.toString()) throw new Error('email or phone exist');
                        
            Object.assign(manager, req.body);
            await manager.save();

            const response: JsonResponse = {
                success: true,
                message: 'mis a jour effectué avec success',
                data: manager
            }

            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            res.status(500).json(response);
        }
    }

    public static async delete(req: Request, res: Response): Promise<void> {
        try {
            const manager = await Manager.findById(req.params.id);
            if (!manager) throw new Error('Manager not found');

            await manager.deleteOne();
            const response: JsonResponse = {
                success: true,
                message: 'manager supprimé avec success'
            }

            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            res.status(500).json(response);
        }
    }

    public static async count(req: Request, res: Response): Promise<void> {
        try {
            const count = await Manager.countDocuments(this.filters(req.query));

            const response: JsonResponse = {
                success: true,
                message: 'manager envoyé avec success',
                data: count
            }
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            res.status(500).json(response);
        }
    }
}
