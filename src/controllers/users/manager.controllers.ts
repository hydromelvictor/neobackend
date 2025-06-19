import { Request, Response } from 'express';
import Manager from '../../models/users/manager.model';
import { addToBlacklist, removeFromBlacklist } from '../../helpers/codecs.helpers';
import { generateToken, verifyToken } from '../../helpers/token.helpers';
import gmail from '../../helpers/gmail.helpers';
import { emailToSign } from '../../helpers/html.helpers';
import logger from '../../helpers/logger.helpers';



export default class ManagerController {
    private filters = (q: any): any => {
        const filter: any = {};

        if (q.name) {
            const regex = { $regex: q.name, $options: 'i' };
            filter.$or = [
                { firstname: regex },
                { lastname: regex }
            ];
        }

        if (q.online) filter.online = q.online === 'true';
        if (q.auth) filter.isAuthenticated = q.auth === 'true';
        
        return filter;
    
    }

    load = async (req: Request, res: Response): Promise<void> => {
        try {
            const requiredFields = ['firstname', 'lastname', 'phone', 'email', 'position'];
            const missingFields = requiredFields.filter(field => !req.body[field]);
            if (missingFields.length > 0) throw new Error(`Missing required fields: ${missingFields.join(', ')}`);

            const manager = await Manager.findOne({ 
                $or: [
                    { email: req.body.email }, 
                    { phone: req.body.phone }
                ]
            });
            if (manager) throw new Error('Manager with the same email or phone already exists');

            const token = await generateToken(req.body);
            if (!token) throw new Error('Failed to generate token');

            const otp = addToBlacklist(token);
            await gmail(req.body.email, 'VERIFICATION DE MAIL', emailToSign(`${req.body.firstname} ${req.body.lastname}`, otp));

            res.status(200).send()
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

    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = removeFromBlacklist(req.body.otp);
            if (!token) throw new Error('Invalid OTP');

            const decoded = await verifyToken(token);
            if (!decoded) throw new Error('Invalid token');

            const manager = new Manager(decoded);
            await manager.save();

            res.status(201).json(manager);
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

    password = async (req: Request, res: Response): Promise<void> => {
        try {
            const manager = await Manager.findById(req.params.id);
            if (!manager) throw new Error('Manager not found');

            manager.password = req.body.password;
            manager.online = false;
            manager.isAuthenticated = false;
            manager.disconnected = `hors ligne depuis le ${new Date().toISOString().split('T')[0]}`;
            await manager.save();

            res.status(200).send();
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
}
