import { Request, Response } from 'express';
import logger from '../../helpers/logger.helpers';
import MentorService from '../../service/holding/mentor.service';
import forgot from '../../service/verify.service';
import verify from '../../service/verify.service';
import reset from '../../service/reset.service';
import logout from '../../service/logout.service';

export default class MentorController {
    private service: MentorService;

    constructor() {
        this.service = new MentorService();
    }

    async register(req: Request, res: Response) {
        try {
            await this.service.signUpEmailStep(req.body);
            res.status(200).send();
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message)
                res.status(400).json({ message: error.message });
            } else {
                logger.error('Une erreur inconnue est survenue.')
                // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    async checked(req: Request, res: Response) {
        try {
            const token = await this.service.signUpVerifyStep(req.body.code);
            res.status(201).json(token);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message)
                res.status(400).json({ message: error.message });
            } else {
                logger.error('Une erreur inconnue est survenue.')
                // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    async addPassword(req: Request, res: Response) {
        try {
            await this.service.signUpPasswordStep(req.body.password, req.anonymous);
            res.status(200).send();
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message)
                res.status(400).json({ message: error.message });
            } else {
                logger.error('Une erreur inconnue est survenue.')
                // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    async login(req: Request, res: Response) {
        try {
            const tokens = await this.service.login(req.body.email, req.body.password);
            res.status(200).json(tokens);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message)
                res.status(400).json({ message: error.message });
            } else {
                logger.error('Une erreur inconnue est survenue.')
                // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    async referClick(req: Request, res: Response) {
        try {
            const mentor = await this.service.get({ _id: req.auth._id });
            await this.service.update({ _id: req.auth._id }, { referClick: mentor.referClick + 1 });
            res.status(200).send();
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message)
                res.status(400).json({ message: error.message });
            } else {
                logger.error('Une erreur inconnue est survenue.')
                // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    async update(req: Request, res: Response) {
        try {
            await this.service.update({ _id: req.auth._id }, req.body);
            res.status(200).send();
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message)
                res.status(400).json({ message: error.message });
            } else {
                logger.error('Une erreur inconnue est survenue.')
                // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    async get(req: Request, res: Response) {
        try {
            const mentor = await this.service.get({ _id: req.params.id as any || req.auth._id });
            res.status(200).json(mentor);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message)
                res.status(400).json({ message: error.message });
            } else {
                logger.error('Une erreur inconnue est survenue.')
                // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    async forgot(req: Request, res: Response) {
        try {
            const mentor = await this.service.get(req.body);
            await forgot(mentor);
            res.status(200).send();
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message)
                res.status(400).json({ message: error.message });
            } else {
                logger.error('Une erreur inconnue est survenue.')
                // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    async verify(req: Request, res: Response) {
        try {
            const id = await verify(req.body.code);
            const mentor = await this.service.get({ _id: id as any });
            res.status(200).json(mentor);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message)
                res.status(400).json({ message: error.message });
            } else {
                logger.error('Une erreur inconnue est survenue.')
                // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    async reset(req: Request, res: Response) {
        try {
            const mentor = await this.service.get({ _id: req.params.id as any });
            await reset(req.body.password, mentor);
            res.status(200).send();
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message)
                res.status(400).json({ message: error.message });
            } else {
                logger.error('Une erreur inconnue est survenue.')
                // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const mentor = await this.service.get({ _id: req.auth._id });
            await logout(mentor);
            res.status(200).send();
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message)
                res.status(400).json({ message: error.message });
            } else {
                logger.error('Une erreur inconnue est survenue.')
                // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }
}
