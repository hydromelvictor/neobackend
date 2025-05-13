import { Request, Response } from 'express';
import logger from '../../helpers/logger.helpers';
import TransactionService from '../../service/market/transaction.service';

export default class TransController {
    private service: TransactionService;

    constructor() {
        this.service = new TransactionService();
    }

    async readWithdraw(req: Request, res: Response) {
        try {
            const { page, limit } = req.query
            const withdraws = await this.service.find(
                { account: req.params.account as any, type: 'withdrawal' },
                page ? Number(page) : 1,
                limit ? Number(limit) : 10
            );
            res.status(200).json(withdraws)
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message)
                return res.status(400).json({ message: error.message });
            } else {
                logger.error('Une erreur inconnue est survenue.')
                // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                return res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }
}