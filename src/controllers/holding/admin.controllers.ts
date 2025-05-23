import { Request, Response } from 'express';
import Service from '../../service/holding/admin.service';

export default class AdminController {
    private service: Service;

    constructor() {
        this.service = new Service()
    }

    Register = async (req: Request, res: Response) => {
        try {
            if (!req.auth.staff && !req.auth.authority) throw new Error('Unauthorized');
            const admin = await this.service.RegisterAdmin({ ...req.body });
            res.status(201).json(admin);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    LoginEmail = async (req: Request, res: Response) => {
        try {
            await this.service.LoginByEmail(req.body.email);
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

    LoginPass = async (req: Request, res: Response) => {
        try {
            const tokens = await this.service.LoginPass(req.body.code);
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
            if (!req.auth.staff) throw new Error('Unauthorized');
            const admin = await this.service.Get(req.params.id);
            res.status(200).json(admin)
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
            if (!req.auth.staff) throw new Error('Unauthorized');
            
            const data = { ...req.query };
            const options = {
                page: data.page || 1,
                limit: data.limit || 30,
                createdAt: -1
            }

            if (data.page) delete data['page'];
            if (data.limit) delete data['limit'];

            const admins = await this.service.Find(data, options);
            res.status(200).json(admins);
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
            if (!req.auth.staff || (req.auth._id !== req.params.id && !req.auth.authority)) throw new Error('Unauthorized');
            const admin = await this.service.Update(req.params.id || req.auth._id, req.body);
            res.status(200).json(admin);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    CheckEmailForUpdate = async (req: Request, res: Response) => {
        try {
            await this.service.CheckEmailUpdate(req.auth._id, req.body.email);
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

    UpdateEmail = async (req: Request, res: Response) => {
        try {
            const admin = await this.service.UpdateEmail(req.auth._id, req.body.code);
            res.status(200).json(admin);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    RECOVERY = async (req: Request, res: Response) => {
        try {
            const tokens = await this.service.Recovery(req.body.token);
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

    REMOVE = async (req: Request, res: Response) => {
        try {
            if (!req.auth.staff && !req.auth.authority) throw new Error('Unauthorized');
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
            const size = await this.service.Size(req.query);
            res.status(200).json(size);
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