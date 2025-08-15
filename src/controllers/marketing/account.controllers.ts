import { Request, Response } from 'express';
import Account from '../../models/marketing/account.models';
import Xaccount from '../../models/marketing/critical.models';
import { JsonResponse } from '../../types/api';
import orgModels from '../../models/associate/org.models';
import mongoose from 'mongoose';
import trackingModels from '../../models/marketing/invoice.models';


export default class AccountController {
    static filters = (q: any): any => {
        const filter: any = {};

        if (q.min) filter.balance.$gte = parseFloat(q.min);
        if (q.max) filter.balance.$lte = parseFloat(q.max);
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

    public static async _in_bank(balance: number): Promise<boolean> {
        const system = await Xaccount.findByName('system');
        if (!system) throw new Error('Système non trouvé');

        system.balance += balance;
        await system.save();

        // 

        return true;
    }

    public static async balance(req: Request, res: Response) {
        try {
            const account = await Account.findOwner(req.user._id);
            if (!account) throw new Error('Compte non trouvé');

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

    public static async list(req: Request, res: Response) {
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

    // assigner un montant
    public static async assignate(req: Request, res: Response) {
        try {
            const amount = parseFloat(req.body.balance);
            
            const account = await Account.findOwner(req.user._id);
            if (!account) throw new Error('Compte non trouvé');
            
            // amount doit etre positif et inferieur ou egal a account.balance
            if (amount <= 0 || amount > account.balance) throw new Error('over');

            const org = await orgModels.findById(req.params.id);
            if (!org) throw new Error('Organisation non trouvée');
            
            let discount = 0
            let total = 0;
            for (const item of account.assign) {
                total += item.balance;
                discount = account.balance - total
                if (amount > discount) throw new Error('over');

                if (item.org.toString() !== org._id.toString()) continue;

                item.balance += amount;
                break;
            }

            account.save();

            const response: JsonResponse = {
                success: true,
                message: 'assign',
                data: account
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

    public static async actes(req: Request, res: Response) {
        const session = await mongoose.startSession();
        try {
            const status = req.query.status;
            const client = await Account.findOwner(req.user._id);
            if (!client) throw new Error('Compte non trouvé');

            const balance = parseFloat(req.body.balance);

            let org: any;
            if (req.query.org) {
                org = await orgModels.findById(req.query.org);
                if (!org) throw new Error('Organisation non trouvée');
            }

            if (status === 'deposit') {
                const check = balance > 0 && await AccountController._in_bank(balance);
                if (check) {
                    client.balance += balance;
                    await client.save();

                    await trackingModels.create({
                        type: 'deposit',
                        amount: balance + 0.05 * balance,
                        currency: req.body.currency,
                        baseCurrency: 'XOF',
                        status: 'completed',
                        description: 'deposité avec succès',
                        to: client._id,
                        processedAt: new Date()
                    });
                }
            } else if (status === 'withdrawal') {
                const check = client.balance >= balance && await AccountController._in_bank(-balance);
                if (check) {
                    client.balance -= req.body.balance;
                    client.assign.forEach(item => {
                        if (org && item.org.toString() === org._id.toString() && item.balance && item.balance >= req.body.balance) {
                            item.balance -= req.body.balance;
                        }
                    });
                    await client.save();

                    await trackingModels.create({
                        type: 'withdrawal',
                        amount: balance + 0.05 * balance,
                        currency: req.body.currency,
                        baseCurrency: 'XOF',
                        status: 'completed',
                        description: 'retrait avec succès',
                        from: client._id,
                        processedAt: new Date()
                    });
                }
            } else {
                const check = client.balance >= balance && balance > 0;
                const neo = await Xaccount.findByName('neo');
                if (!neo) throw new Error('Système non trouvé');

                if (check) {
                    // atomic
                    session.startTransaction();
                    client.balance -= balance;
                    client.assign.forEach(item => {
                        if (org && item.org.toString() === org._id.toString() && item.balance && item.balance >= balance) {
                            item.balance -= balance;
                        }
                    });
                    neo.balance += balance;
                    await client.save({ session });
                    await neo.save({ session });

                    await trackingModels.create({
                        type: 'payment',
                        amount: balance + 0.05 * balance,
                        currency: req.body.currency,
                        baseCurrency: 'XOF',
                        status: 'completed',
                        description: 'paiement effectué avec succès',
                        from: client._id,
                        to: neo._id,
                        processedAt: new Date()
                    }, { session });

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
