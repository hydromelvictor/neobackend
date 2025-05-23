import { Request, Response, NextFunction } from 'express';
import { decodeToken } from '../helpers/token.helpers';

const anonymous = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decoded = await decodeToken(req);
        console.log(decoded);
        if (!decoded) throw new Error('invalide token');

        req.anonymous = decoded;
        next();
    } catch (err: any) {
        res.status(401).json({ message: err.message || 'Accès refusé' });
    }
}

export default anonymous;
