import { JsonResponse } from '../../types/api';
import Tracking from '../../models/marketing/invoice.models';
import Rate from '../../models/automation/rate.models';
import Account from '../../models/marketing/account.models';


export default class MoneyController {

    // nom du service de paiement (Wave, Orange Money, PayPal, Stripe, etc.)
    private service: string;
    
    constructor(service: string) {
        // constructeur vide
        this.service = service;
    }

    public static async deposit(
        data: { 
            account: string, 
            amount: number, 
            currency: string,
            description: string
        }): Promise<JsonResponse> {
        
        try {
            if (!data.account) throw new Error('L\'identifiant du compte est requis');
            if (!data.amount || data.amount <= 0) throw new Error('Le montant doit être supérieur à 0');
            if (!data.currency) data.currency = 'XOF';

            const exchangeRate = await Rate.findOne({ base: 'XOF', target: data.currency }).sort({ fetchedAt: -1 }).then(r => r?.rate);
            if (!exchangeRate) throw new Error(`Le taux de change pour la devise ${data.currency} n'est pas disponible`);

            // creer une trace de l'operation
            const tracking = new Tracking({
                type: 'DEPOSIT',
                amount: data.amount,
                currency: data.currency,
                baseCurrency: 'XOF',
                exchangeRate,
                status: 'PENDING',
                description: data.description,
                from: data.account,
                to: data.account,
                processedAt: new Date()
            });
            await tracking.save();

            const response: JsonResponse = {
                success: true,
                message: 'Dépôt initié avec succès',
                data: {
                    trackingId: tracking._id
                }
            };
            return response;
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            return response;
        }
    }

    public static async withdraw(
        data: { 
            account: string, 
            amount: number, 
            currency: string,
            description: string
        }): Promise<JsonResponse> {
        
        try {
            if (!data.account) throw new Error('L\'identifiant du compte est requis');
            if (!data.amount || data.amount <= 0) throw new Error('Le montant doit être supérieur à 0');
            if (!data.currency) data.currency = 'XOF';

            const exchangeRate = await Rate.findOne({ base: 'XOF', target: data.currency }).sort({ fetchedAt: -1 }).then(r => r?.rate);
            if (!exchangeRate) throw new Error(`Le taux de change pour la devise ${data.currency} n'est pas disponible`);

            // creer une trace de l'operation
            const tracking = new Tracking({
                type: 'WITHDRAWAL',
                amount: data.amount,
                currency: data.currency,
                baseCurrency: 'XOF',
                exchangeRate,
                status: 'PENDING',
                description: data.description,
                from: data.account,
                to: data.account,
                processedAt: new Date()
            });
            await tracking.save();

            const response: JsonResponse = {
                success: true,
                message: 'Retrait initié avec succès',
                data: {
                    trackingId: tracking._id
                }
            };
            return response;
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            return response;
        }
    }

    public static async payment(
        data: { 
            from: string,
            to?: string,
            amount: number, 
            currency: string,
            description: string
        }): Promise<JsonResponse> {
            try {
                if (!data.from) throw new Error('L\'identifiant du compte est requis');
                if (!data.amount || data.amount <= 0) throw new Error('Le montant doit être supérieur à 0');
                if (!data.currency) data.currency = 'XOF';
    
                const exchangeRate = await Rate.findOne({ base: 'XOF', target: data.currency }).sort({ fetchedAt: -1 }).then(r => r?.rate);
                if (!exchangeRate) throw new Error(`Le taux de change pour la devise ${data.currency} n'est pas disponible`);

                const system = await Account.findOne({ name: 'system' });
                if (!system) throw new Error('Le compte système est introuvable');
    
                // creer une trace de l'operation
                const tracking = new Tracking({
                    type: 'PAYMENT',
                    amount: data.amount,
                    currency: data.currency,
                    baseCurrency: 'XOF',
                    exchangeRate,
                    status: 'PENDING',
                    description: data.description,
                    from: data.from,
                    to: system._id,
                    processedAt: new Date()
                });
                await tracking.save();

                data.to = system._id.toString();
                const response: JsonResponse = {
                    success: true,
                    message: 'Paiement initié avec succès',
                    data: {
                        trackingId: tracking._id
                    }
                };
                return response;
            } catch (error: any) {
                console.error('Erreur lors de la validation du code:', error);
    
                const response: JsonResponse = {
                    success: false,
                    message: 'Erreur interne du serveur',
                    error: error.message
                };
    
                return response;
            }
    }


    public static async refund(trackingId: string): Promise<JsonResponse>{
        try {
            if (!trackingId) throw new Error('L\'identifiant de la transaction est requis');

            const tracking = await Tracking.findById(trackingId);
            if (!tracking) throw new Error('La transaction est introuvable');

            if (tracking.status !== 'COMPLETED') throw new Error('La transaction ne peut pas être remboursée');

            // creer une trace de l'operation
            const refund = new Tracking({
                type: 'REFUND',
                amount: tracking.amount,
                currency: tracking.currency,
                baseCurrency: tracking.baseCurrency,
                exchangeRate: tracking.exchangeRate,
                status: 'PENDING',
                description: `Remboursement de la transaction ${tracking._id}`,
                from: tracking.to,
                to: tracking.from,
                processedAt: new Date()
            });
            await refund.save();

            const response: JsonResponse = {
                success: true,
                message: 'Remboursement initié avec succès',
                data: {
                    trackingId: refund._id
                }
            };
            return response;
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            return response;
        }
        
    }
}