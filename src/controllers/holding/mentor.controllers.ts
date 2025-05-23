import { Request, Response } from 'express';
import Service from '../../service/holding/mentor.service';

export default class MentorController {
    private service: Service;

    constructor() {
        this.service = new Service();
    }

    LOAD = async (req: Request, res: Response) => {
        try {
            await this.service.SignUpToEmail({ ...req.body });
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
            const mentor = await this.service.Register(req.body.code);
            res.status(200).json(mentor);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    AddPassword = async (req: Request, res: Response) => {
        try {
            await this.service.AddPassword(req.params.id, req.body.password);
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

    LOGIN = async (req: Request, res: Response) => {
        try {
            const tokens = await this.service.Login({ ...req.body });
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
            const mentor = await this.service.Get(req.params.id);
            res.status(200).json(mentor);
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
            const mentors = await this.service.Find(data, options);
            res.status(200).json(mentors);
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
            const mentor = await this.service.Update(req.params.id, { ...req.body });
            res.status(200).json(mentor);
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
            res.status(204).send();
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
            const count = await this.service.Size({ ...req.query});
            res.status(200).json(count)
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