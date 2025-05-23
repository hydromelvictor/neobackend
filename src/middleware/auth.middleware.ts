import { Request, Response, NextFunction } from 'express';
import { decodeToken } from '../helpers/token.helpers';

import Admin from '../models/holding/admin.models';
import Member from '../models/holding/member.models';
import Mentor from '../models/holding/mentor.models';
import Lead from '../models/holding/lead.models';

import Device from '../models/shadow/device.models';
import { lookup as geoipLookup } from 'geoip-lite';
import UAParser from 'ua-parser-js';

declare global {
    namespace Express {
        interface Request {
            auth?: any;
            anonymous?: any;
        }
    }
}

declare module 'express-serve-static-core' {
  interface Request {
    device?: any;
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decoded = await decodeToken(req);
        if (!decoded) throw new Error('invalide token');

        const user = await Admin.findById(decoded) || await Member.findById(decoded) || await Mentor.findById(decoded) || await Lead.findById(decoded);
        if (!user) throw new Error('Unauthorized');

        const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || req.ip
        const userAgent = req.headers['user-agent'] || ''
        const parser = new UAParser(userAgent);
        const uaResult = parser.getResult();

        const geo = ip ? geoipLookup(ip) : null;

        const device = await Device.create({
            hote: user._id,
            path: req.originalUrl,
            sessionId: req.headers['authorization']?.split(' ')[1],
            type: (user.constructor as any).modelName,
            method: req.method,
            ip,
            userAgent,
            browser: uaResult.browser.name || '',
            os: uaResult.os.name || 'Other',
            location: geo ? {
                country: geo.country,
                city: geo.city,
                region: geo.region,
                lat: geo.ll[0],
                lon: geo.ll[1],
            } : {}
        })
        await device.save();

        req.device = device;

        req.auth = user;
        if (user.staff && user.authority) next();

        if (!user.isAuthenticated || !user.online) throw new Error('Unauthorized');

        next();
    } catch (err: any) {
        res.status(401).json({ message: err.message || 'Accès refusé' });
    }
}

export default auth;
