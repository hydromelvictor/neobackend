import { Request, Response } from 'express';
import MemberService from '../../service/holding/member.service';
import logger from '../../helpers/logger.helpers';

export default class MemberController {
    private service: MemberService;

    constructor() {
        this.service = new MemberService();
    }

    async register(req: Request, res: Response) {
        try {
            await this.service.register({ ...req.body });
            res.status(200).send();
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

    async login(req: Request, res: Response) {
        try {
            const data = await this.service.login(req.body);
            res.status(200).json(data);
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

    async forgot(req: Request, res: Response) {
        try {
            await this.service.forgot(req.body.email);
            res.status(200).send();
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

    async verify(req: Request, res: Response) {
        try {
            const member = await this.service.verify(req.body.code);
            res.status(200).json(member)
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

    async reset(req: Request, res: Response) {
        try {
            await this.service.reset(req.body.password, req.params.id);
            res.status(200).send();
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

    async logout(req: Request, res: Response) {
        try {
            await this.service.logout(req.params.id);
            res.status(200).send();
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

    async(req: Request, res: Response) {
        try {

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