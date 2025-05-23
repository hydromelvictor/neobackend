import { Request, Response } from 'express';
import Service from '../../service/holding/member.service';

export default class MemberController {
    private service: Service;

    constructor() {
        this.service = new Service();
    }

    REGISTER = async (req: Request, res: Response) => {
        try {
            const members = await this.service.Find({ org: req.body.org }, {});
            if ((members.length && !req.auth) || (req.auth && !req.auth.authority)) throw new Error('Unauthorized');

            const member = await this.service.Create({ ...req.body });
            res.status(201).json(member);
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
            const member = await this.service.Get(req.params.id);
            res.status(200).json(member);
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

            const members = await this.service.Find(data, options);
            res.status(200).json(members);
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
            const member = await this.service.Update(req.params.id, req.body);
            res.status(200).json(member);
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