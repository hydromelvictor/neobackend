import { Request, Response } from 'express';
import logger from '../../helpers/logger.helpers';
import AccountService from '../../service/market/account.service';


export default class AccountController {
    private service: AccountService;

    constructor() {
        this.service = new AccountService();
    }

    async balance(req: Request, res: Response) {
        try {
            const account = await this.service.get({ owner: req.auth._id });
            res.status(200).json(account);
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