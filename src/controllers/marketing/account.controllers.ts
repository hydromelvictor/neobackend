import { Request, Response } from 'express';
import Account from '../../models/marketing/account.models';
import Xaccount from '../../models/marketing/critical.models';
import { JsonResponse } from '../../types/api';
import orgModels from '../../models/associate/org.models';
import mongoose from 'mongoose';


export default class AccountController {
    static filters = (q: any): any => {
        const filter: any = {};

        if (q.min) filter.balance.$gte = parseFloat(q.min);
        if (q.max) filter.balance.$lte = parseFloat(q.max);
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

    static async _in_bank(balance: number): Promise<boolean> {
        const system = await Xaccount.findByName('system');
        if (!system) throw new Error('Système non trouvé');
        
        system.balance += balance;
        await system.save();

        // 
        
        return true;
    }

    static async create(req: Request, res: Response) {
        try {
            const account = await Account.create({ owner: req.user._id });
            const response: JsonResponse = {
                success: true,
                message: 'Compte créé avec succès',
                data: account
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

    static async balance(req: Request, res: Response) {
        try {
            const account = await Account.findOwner(req.user._id);
            const response: JsonResponse = {
                success: true,
                message: 'Compte trouvé avec succès',
                data: account
            };
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

    static async list(req: Request, res: Response) {
        try {
            const filter = AccountController.filters(req.query);
            const options = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                sort: { createdAt: -1 }
            };

            const accounts = await Account.paginate(filter, options);
            const response: JsonResponse = {
                success: true,
                message: 'Comptes trouvés avec succès',
                data: accounts
            };
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

    static async update(req: Request, res: Response) {
        try {
            const account = await Account.findOwner(req.user._id);
            if (!account) throw new Error('Compte non trouvé');

            const org = await orgModels.findById(req.params.id);
            if (!org) throw new Error('Organisation non trouvée');


            let check = false
            for (const item of account.assign) {
                if (item.org.toString() === org._id.toString()) {
                    item.balance += req.body.balance;
                    check = true;
                    break;
                }
            }

            if (check === false) {
                account.assign.push({
                    org: org._id,
                    balance: req.body.balance || 0
                });
            }
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

    static async actes(req: Request, res: Response) {
        const session = await mongoose.startSession();
        try {
            const status = req.query.status;
            const client = await Account.findOwner(req.user._id);
            if (!client) throw new Error('Compte non trouvé');

            const balance = req.body.balance;
            if (status === 'deposit') {
                const check = balance > 0 && await AccountController._in_bank(balance);
                if (check) {
                    client.balance += req.body.balance;
                    await client.save();
                }
            } else if (status === 'withdrawal') {
                const check = client.balance >= balance && await AccountController._in_bank(-balance);
                if (check) {
                    client.balance -= req.body.balance;
                    await client.save();
                }
            } else {
                const check = client.balance >= balance && balance > 0;
                const neo = await Xaccount.findByName('neo');
                if (!neo) throw new Error('Système non trouvé');
                
                if (check) {
                    // atomic
                    session.startTransaction();
                    client.balance -= balance;
                    neo.balance += balance;
                    await client.save({ session });
                    await neo.save({ session });
                    await session.commitTransaction();
                    session.endSession();
                }
            }
        } catch (error: any) {
            await session.abortTransaction();
            session.endSession();
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
