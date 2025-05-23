import { Request, Response } from 'express';
import Service from '../../service/holding/lead.service';

export default class LeadController {
    private service: Service;

    constructor() {
        this.service = new Service()
    }

    REGISTER = async (req: Request, res: Response) => {
        try {
            const lead = await this.service.Create();
            res.status(201).json(lead);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    LOGIN = async (req: Request, res: Response) => {
        try {
            const tokens = await this.service.Login(req.params.id);
            res.status(200).json(tokens);
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
            const lead = await this.service.Get(req.params.id);
            res.status(200).json(lead);
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

            const leads = await this.service.Find(data, options);
            res.status(200).json(leads);
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
            if (!req.auth.staff && req.auth._id !== req.params.id) throw new Error('Unauthorized');
            const lead = await this.service.Update(req.params.id, req.body);
            res.status(200).json(lead);
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
            if (!req.auth.staff) throw new Error('Unauthorized');
            await this.service.Remove(req.params.id);
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