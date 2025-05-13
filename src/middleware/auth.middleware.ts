import { Request, Response, NextFunction } from 'express';
import { decodeToken } from '../helpers/token.helpers';

import Admin from '../models/holding/admin.models';
import Member from '../models/holding/member.models';
import Mentor from '../models/holding/mentor.models';
import Lead from '../models/holding/lead.models';

declare global {
    namespace Express {
        interface Request {
            auth?: any;
            anonymous?: any;
        }
    }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decoded = await decodeToken(req);
        if (!decoded) throw new Error('invalide token');

        const user = await Admin.findById(decoded)
            || await Member.findById(decoded)
            || await Mentor.findById(decoded)
            || await Lead.findById(decoded);

        if (!user || !user.isAuthenticated) throw new Error('Unauthorized');

        req.auth = { ...user.toObject() }
        next();
    } catch (err: any) {
        res.status(401).json({ message: err.message || 'Accès refusé' });
    }
}

export default auth;
