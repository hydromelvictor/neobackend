import { Request, Response } from 'express';
import { JsonResponse } from '../../types/api';
import Referer from '../../models/users/referer.models';
import { generateToken, verifyToken } from '../../helpers/token.helpers';
import { addToBlacklist, OneUseToken, validateAndUseCode } from '../../helpers/codecs.helpers';
import gmail from '../../helpers/gmail.helpers';
import accountModels from '../../models/marketing/account.models';
import { emailToSign } from '../../helpers/html.helpers';


export default class RefererController {
    public static filters(q: any): any {
        const filter: any = {};

        if (q.name) {
            const regex = { $regex: q.name, $options: 'i' };
            filter.$or = [
                { fullname: regex },
                { country: regex },
                { city: regex }
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
            const referer = await Referer.findOne({ $or: [
                { phone: req.params.phone },
                { email: req.params.phone },
            ]});
            if (referer) throw new Error('Manager with the same email or phone already exists');

            let promo = OneUseToken();
            let ref = await Referer.findOne({ promo: promo });
            while (ref) {
                promo = OneUseToken();
                ref = await Referer.findOne({ promo: promo });
            }

            const token = generateToken({ ...req.body, promo: promo });
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

            const referer = new Referer(result.data);
            await referer.save();

            accountModels.create({ owner: referer._id });

            const response: JsonResponse = {
                success: true,
                message: 'Erreur interne du serveur',
                data: referer
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

    static async password(req: Request, res: Response): Promise<void> {
        try {
            const referer = await Referer.findById(req.params.id);
            if (!referer) throw new Error('Referer not found');

            referer.password = req.body.password;
            referer.online = false;
            referer.isAuthenticated = false;
            referer.disconnected = `hors ligne depuis le ${new Date().toISOString().split('T')[0]}`;
            await referer.save();

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
            const referer = await Referer.findById(req.params.id);
            if (!referer) throw new Error('Manager not found');

            referer.click = referer.click + 1;
            await referer.save();

            const response: JsonResponse = {
                success: true,
                message: 'manager envoyé avec success',
                data: referer
            }
            res.status(200).json(response);

        }catch (error: any) {
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
            const referers = await Referer.paginate(RefererController.filters(req.query), options);

            const response: JsonResponse = {
                success: true,
                message: 'list managers envoyé avec success',
                data: referers
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
            const referer = await Referer.findById(req.params.id);
            if (!referer) throw new Error('Manager not found');

            const email = req.body.email;
            const phone = req.body.phone;
            const promo = req.body.promo
            const exist = await Referer.findOne({
                $or: [
                    email ? { email } : {},
                    phone ? { phone } : {},
                    promo ? { promo } : {}
                ]
            })
            if (exist?._id.toString() !== referer._id.toString()) throw new Error('email or phone exist');
                        
            Object.assign(referer, req.body);
            await referer.save();

            const response: JsonResponse = {
                success: true,
                message: 'mis a jour effectué',
                data: referer
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
            const referer = await Referer.findById(req.params.id);
            if (!referer) throw new Error('Manager not found');

            await referer.deleteOne();
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
            const count = await Referer.countDocuments(this.filters(req.query));

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