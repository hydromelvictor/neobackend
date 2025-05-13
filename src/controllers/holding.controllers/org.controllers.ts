import { Request, Response } from 'express';
import OrgService from '../../service/holding/org.service';
import logger from '../../helpers/logger.helpers';


export default class OrgController {
    private service: OrgService;

    constructor() {
        this.service = new OrgService();
    }

    async register(req: Request, res: Response) {
        try {
            if (!(req.body.lon && req.body.lat)) throw new Error('lon et lat missing');

            const q: any = {
                ...req.body,
                location: {
                    type: 'Point',
                    coordinates: [req.body.lon, req.body.lat],
                },
            };
            delete q.lon;
            delete q.lat;

            const token = await this.service.register(q);
            res.status(200).json(token);
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

    async loading(req: Request, res: Response) {
        try {
            let token = req.headers['authorization']
            if (!token || !token.startsWith('Bearer')) throw new Error('missing token');

            token = token.split(' ')[1];
            await this.service.loading({ ...req.body }, token);
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
            const org = await this.service.verify(req.body.code);
            res.status(200).json(org);
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

    async mentorReferSize(req: Request, res: Response) {
        try {
            const total = await this.service.size({ mentor: req.params.mentor as any });
            res.status(200).json(total);
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

    async mentorRefer(req: Request, res: Response) {
        try {
            const orgs = await this.service.find({ mentor: req.params.mentor as any });
            res.status(200).json(orgs);
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

    async (req: Request, res: Response) {
        try {

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
