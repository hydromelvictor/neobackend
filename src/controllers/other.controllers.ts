import { Request, Response } from 'express';
import AUTHORIZATION from '../service/authorization.service';
import logout from '../service/logout.service';
import sendCode from '../service/sendCode.service';
import verify from '../service/verify.service';
import reset from '../service/reset.service';


export default class Others {
    AUTH = async (req: Request, res: Response) => {
        try {
            if (!req.auth.staff && !req.auth.authority) throw new Error("Unauthorized");
            await AUTHORIZATION(req.auth, req.body);
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

    LOGOUT = async (req: Request, res: Response) => {
        try {
            await logout(req.auth);
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

    SEND = async (req: Request, res: Response) => {
        try {
            await sendCode(req.body.email);
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

    VERIFY = async (req: Request, res: Response) => {
        try {
            const instanceId = await verify(req.body.email);
            res.status(200).json(instanceId);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
                res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
            }
        }
    }

    RESET = async (req: Request, res: Response) => {
        try {
            await reset(req.body.password, req.params.id);
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
}