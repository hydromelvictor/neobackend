import { Request, Response } from 'express';
import Account from '../../models/marketing/account.models';
import { JsonResponse } from '../../types/api';
import Org from '../../models/associate/org.models';
import mongoose from 'mongoose';
import Tracking from '../../models/marketing/invoice.models';
import MoneyController from './money.controllers';


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

    public static async create(req: Request, res: Response) {
        try {
            const account = await Account.findOwner(req.user._id);
            if (!account || account.main) throw new Error('Compte non trouvé');

            const org = await Org.findById(req.params.id);
            if (!org) throw new Error('Organisation non trouvée');

            // verifie si un compte existe deja pour cette organisation
            const exist = await Account.findOne({ owner: org._id, inherit: account._id });
            if (exist) throw new Error('Un compte existe déjà pour cette organisation');

            // creer un sous compte

            const sub = new Account({
                owner: org._id,
                inherit: account._id,
                currency: account.currency,
            });
            await sub.save();

            const response: JsonResponse = {
                success: true,
                message: 'Compte créé avec succès',
                data: sub
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

    public static async balance(req: Request, res: Response) {
        try {
            const account = await Account.findOwner(req.params.id || req.user._id);
            if (!account) throw new Error('Compte non trouvé');

            const auxilliaries = await Account.find({ inherit: account._id });

            const response: JsonResponse = {
                success: true,
                message: 'Compte trouvé avec succès',
                data: {
                    ...account,
                    aux: auxilliaries
                }
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

    public static async subAccounts(req: Request, res: Response) {
        try {
            const account = await Account.findOwner(req.user._id);
            if (!account || !account.main) throw new Error('Compte non trouvé');

            const filter = AccountController.filters(req.query);
            filter.inherit = account._id;
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

    public static async deposit(req: Request, res: Response) {
        const session = await mongoose.startSession();
        session.startTransaction();

        // operation de depot sur le physique
        const result = await MoneyController.deposit(req.body);
        if (!result.success) res.status(500).json(result);

        const data = result.data;
        try {

            // sur quel compte faire le depot
            const account = await Account.findOwner(data.account);
            if (!account) throw new Error('Compte non trouvé');

            account.balance += data.amount;
            await account.save({ session });

            // si ce n'est pas un compte principal, on credite le compte parent
            if (!account.main) {
                const inherit = await Account.findById(account.inherit);
                if (!inherit) throw new Error('Compte parent non trouvé');

                inherit.balance += data.amount;
                await inherit.save({ session });
            }
            
            // mettre a jour la trace
            const tracking = await Tracking.findById(data.trackingId);
            if (!tracking) throw new Error('Trace non trouvée');

            tracking.status = 'COMPLETED';
            await tracking.save({ session });
            
            await session.commitTransaction();
            session.endSession();

            const response: JsonResponse = {
                success: true,
                message: 'Dépôt effectué avec succès'
            };
            res.status(200).json(response);
        } catch (error: any) {
            // en cas d'erreur, on annule la transaction
            const tracking = await Tracking.findById(data.trackingId);
            if (!tracking) throw new Error('Trace non trouvée');

            tracking.status = 'FAILED';
            await tracking.save({ session });
            
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

    public static async withdraw(req: Request, res: Response) {
        const session = await mongoose.startSession();
        session.startTransaction();

        // operation de retrait sur le physique
        const result = await MoneyController.withdraw(req.body);
        if (!result.success) res.status(500).json(result);

        const data = result.data;
        try {

            // de quel compte faire le retrait
            const account = await Account.findOwner(data.account);
            if (!account) throw new Error('Compte non trouvé');

            if (account.balance < data.amount) throw new Error('Solde insuffisant');
            account.balance -= data.amount;
            await account.save({ session });

            // si ce n'est pas un compte principal, on debite le compte parent
            if (!account.main) {
                const inherit = await Account.findById(account.inherit);
                if (!inherit) throw new Error('Compte parent non trouvé');

                if (inherit.balance < data.amount) throw new Error('Solde insuffisant sur le compte parent');
                inherit.balance -= data.amount;
                await inherit.save({ session });
            }
            
            // mettre a jour la trace
            const tracking = await Tracking.findById(data.trackingId);
            if (!tracking) throw new Error('Trace non trouvée');

            tracking.status = 'COMPLETED';
            await tracking.save({ session });
            
            await session.commitTransaction();
            session.endSession();

            const response: JsonResponse = {
                success: true,
                message: 'Retrait effectué avec succès'
            };
            res.status(200).json(response);
        } catch (error: any) {
            // en cas d'erreur, on annule la transaction
            const tracking = await Tracking.findById(data.trackingId);
            if (!tracking) throw new Error('Trace non trouvée');

            tracking.status = 'FAILED';
            await tracking.save({ session });
            
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

    public static async pay(req: Request, res: Response) {
        const session = await mongoose.startSession();
        session.startTransaction();

        // operation de paiement sur le physique
        const result = await MoneyController.payment(req.body);
        if (!result.success) res.status(500).json(result);

        const data = result.data;
        try {

            // de quel compte faire le paiement
            const from = await Account.findOwner(data.from);
            if (!from) throw new Error('Compte émetteur non trouvé');

            if (from.balance < data.amount) throw new Error('Solde insuffisant');
            from.balance -= data.amount;
            await from.save({ session });

            // si ce n'est pas un compte principal, on debite le compte parent
            if (!from.main) {
                const inherit = await Account.findById(from.inherit);
                if (!inherit) throw new Error('Compte parent non trouvé');

                if (inherit.balance < data.amount) throw new Error('Solde insuffisant sur le compte parent');
                inherit.balance -= data.amount;
                await inherit.save({ session });
            }

            // si le compte destinataire est fourni, on credite ce compte
            if (data.to) {
                const to = await Account.findOwner(data.to);
                if (!to) throw new Error('Compte destinataire non trouvé');

                to.balance += data.amount;
                await to.save({ session });

                // si ce n'est pas un compte principal, on credite le compte parent
                if (!to.main) {
                    const inherit = await Account.findById(to.inherit);
                    if (!inherit) throw new Error('Compte parent non trouvé');

                    inherit.balance += data.amount;
                    await inherit.save({ session });
                }
            } else {
                // sinon on credite le compte system
                const system = await Account.findOne({ name: 'system' });
                if (!system) throw new Error('Compte system non trouvé');

                system.balance += data.amount;
                await system.save({ session });
            }
            
            // mettre a jour la trace
            const tracking = await Tracking.findById(data.trackingId);
            if (!tracking) throw new Error('Trace non trouvée');

            tracking.status = 'COMPLETED';
            await tracking.save({ session });
            
            await session.commitTransaction();
            session.endSession();

            const response: JsonResponse = {
                success: true,
                message: 'Paiement effectué avec succès'
            };
            res.status(200).json(response);
        } catch (error: any) {
            // en cas d'erreur, on annule la transaction
            const tracking = await Tracking.findById(data.trackingId);
            if (!tracking) throw new Error('Trace non trouvée');

            tracking.status = 'FAILED';
            await tracking.save({ session });
            
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

    public static async refund(req: Request, res: Response) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        // operation de remboursement sur le physique
        const result = await MoneyController.refund(req.params.id);
        if (!result.success) res.status(500).json(result);

        const data = result.data;
        try {

            // de quel compte faire le remboursement
            const tracking = await Tracking.findById(data.trackingId);
            if (!tracking) throw new Error('Trace non trouvée');

            const to = await Account.findOwner(tracking.from);
            if (!to) throw new Error('Compte destinataire non trouvé');

            to.balance += tracking.amount;
            await to.save({ session });

            // si ce n'est pas un compte principal, on credite le compte parent
            if (!to.main) {
                const inherit = await Account.findById(to.inherit);
                if (!inherit) throw new Error('Compte parent non trouvé');

                inherit.balance += tracking.amount;
                await inherit.save({ session });
            }

            const from = await Account.findOwner(tracking.to);
            if (!from) throw new Error('Compte émetteur non trouvé');

            if (from.balance < tracking.amount) throw new Error('Solde insuffisant');
            from.balance -= tracking.amount;
            await from.save({ session });

            // si ce n'est pas un compte principal, on debite le compte parent
            if (!from.main) {
                const inherit = await Account.findById(from.inherit);
                if (!inherit) throw new Error('Compte parent non trouvé');

                if (inherit.balance < tracking.amount) throw new Error('Solde insuffisant sur le compte parent');
                inherit.balance -= tracking.amount;
                await inherit.save({ session });
            }
            
            // mettre a jour la trace
            tracking.status = 'REFUNDED';
            await tracking.save({ session });
            
            await session.commitTransaction();
            session.endSession();

            const response: JsonResponse = {
                success: true,
                message: 'Remboursement effectué avec succès'
            };
            res.status(200).json(response);
        } catch (error: any) {
            // en cas d'erreur, on annule la transaction
            const tracking = await Tracking.findById(data.trackingId);
            if (!tracking) throw new Error('Trace non trouvée');

            tracking.status = 'FAILED';
            await tracking.save({ session });
            
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
