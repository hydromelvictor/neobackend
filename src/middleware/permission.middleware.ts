import { Request, Response, NextFunction } from 'express';

const permission = (permission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.auth.authorization.includes(permission)) {
                next();
                req.device.metadata.status = 'Authorized';
                await req.device.save();
            } else {
                req.device.metadata.status = 'Unauthorized';
                await req.device.save();
                throw new Error('Unauthorized');
            }
        } catch (err: any) {
            res.status(401).json({ message: err.message || 'Accès refusé' });
        }
    }
}

export default permission;