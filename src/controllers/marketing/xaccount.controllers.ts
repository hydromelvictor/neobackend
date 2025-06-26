import { Request, Response } from 'express';
import Xaccount from '../../models/marketing/critical.models';
import { JsonResponse } from '../../types/api';



export default class XaccountController {
    static async balance(req: Request, res: Response) {
        try {
            const account = await Xaccount.findByName(req.params.name);
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

    static async update(req: Request, res: Response) {
        try {
            const account = await Xaccount.findByName(req.params.name);
            if (!account) throw new Error('Compte non trouvé');

            account.balance += req.body.balance;
            await account.save();

            const response: JsonResponse = {
                success: true,
                message: 'Compte mis à jour avec succès'
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
}
