import { Request, Response } from 'express';
import logger from '../../helpers/logger.helpers';


const login = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        if (error instanceof Error) {
            logger.error(error.message);
            res.status(400).json({ error: error.message });
        } else {
            logger.error('Une erreur inconnue est survenue.');
            res.status(400).json({ error: 'Une erreur inconnue est survenue.' });
        }
    }
}