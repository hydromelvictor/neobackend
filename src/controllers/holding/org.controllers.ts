import { Request, Response } from 'express';
import Service from '../../service/holding/org.service';

export default class Org {
    private service: Service;

    constructor() {
        this.service = new Service();
    }

    LOAD = async (req: Request, res: Response) => {
        try {
            const data = { ...req.body };

            if (!data.lon || !data.lat) throw new Error('lon or lat missing');
            data.location = {
                type: 'Point',
                coordinates: [Number(data.lon), Number(data.lat)]
            }

            delete data['lon'];
            delete data['lat'];
            await this.service.SignUpLoading(data);
            res.status(200).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    REGISTER = async (req: Request, res: Response) => {
        try {
            const org = await this.service.Register(req.body.code);
            res.status(201).json(org);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    GET = async (req: Request, res: Response) => {
        try {
            const org = await this.service.Get(req.params.id);
            res.status(200).json(org);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    SEARCH = async (req: Request, res: Response) => {
        try {
            const data = { ...req.query };
            const options = {
                page: data.page || 1,
                limit: data.limit || 30,
                createdAt: -1
            }

            if (data.page) delete data['page'];
            if (data.limit) delete data['limit'];

            const orgs = await this.service.Find(data, options);
            res.status(200).json(orgs);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    UPDATE = async (req: Request, res: Response) => {
        try {
            const org = await this.service.Update(req.params.id, { ...req.body });
            res.status(200).json(org);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    REMOVE = async (req: Request, res: Response) => {
        try {
            await this.service.Remove(req.params.id);
            res.status(200).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    SIZE = async (req: Request, res: Response) => {
        try {
            const count = await this.service.Size({ ...req.query });
            res.status(200).json(count);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }
}