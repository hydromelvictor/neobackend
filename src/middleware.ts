import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
const UAParser = require('ua-parser-js');
import { lookup as geoipLookup } from 'geoip-lite';

import { decodeTokenFromRequest } from './helpers/token.helpers';

import mongoose from 'mongoose';
import Device from './models/stats/device.models';
import { JsonResponse } from './types/api';

import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Extension de l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: any;
      io?: any;
    }
  }
}

/**
 * Créateur de middleware de limitation de débit
 */
export const rateLimiter = (options: {
  windowMs: number;
  max: number;
  message: any;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      const response: JsonResponse = {
        success: false,
        message: options.message,
        error: 'depassement de limit'
      }
      res.status(429).json(response);
    }
  });
};

/**
 * Middleware d'authentification basique
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = decodeTokenFromRequest(req);
    if (!result.success) {
      const response: JsonResponse = {
        success: false,
        message: 'Token d\'authentification requis',
        error: 'No token provided'
      }
      res.status(401).json(response);
      return;
    }

    const decoded: any = result.data;
    const Instance = mongoose.model(decoded.model);
    
    const user = await Instance.findById(decoded.id);
    if (!user || !user.isAuthenticated || !user.online) {
      const response: JsonResponse = {
        success: false,
        message: 'Non autorisée',
        error: 'Unauthorized'
      }
      res.status(401).json(response);
      return;
    }

    req.user = user
    next();
  } catch (error) {
    const response: JsonResponse = {
      success: false,
      message: 'Token invalide',
      error: 'Invalid token'
    }
    res.status(401).json(response);
  }
};

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const device = (actionType: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || req.ip;
      const agent = req.headers['user-agent'] || '';

      const parser = new UAParser(agent);
      const ua = parser.getResult();

      const geo = ip ? geoipLookup(ip) : null;

      const device = new Device({
        hote: req.user._id,
        path: req.originalUrl,
        type: actionType,
        method: req.method,
        ip,
        agent,
        browser: ua.browser.name || '',
        os: ua.os.name || 'Other',
        location: geo ? {
          country: geo.country,
          city: geo.city,
          region: geo.region,
          lat: geo.ll[0],
          lon: geo.ll[1]
        }: {}
      });
      await device.save();
      next()
    } catch (error) {
      const response: JsonResponse = {
        success: false,
        message: 'Token invalide',
        error: 'Invalid token'
      }
      res.status(401).json(response);
    }
  }
}


/**
 * Middleware de validation des permissions spécifiques
 */
export const permissions = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        const response: JsonResponse = {
          success: false,
          message: 'Authentification requise',
          error: 'Authentication required'
        }
        res.status(401).json(response);
        return;
      }

      if (!req.user.permissions.includes(permission)) {
        const response: JsonResponse = {
          success: false,
          message: `Permission requise: ${permission}`,
          error: 'Insufficient permissions'
        }
        res.status(403).json(response);
        return;
      }

      next();
    } catch (error) {
      const response: JsonResponse = {
        success: false,
        message: 'Erreur de validation des permissions',
        error: 'Permission validation error'
      }
      res.status(500).json(response);
    }
  };
};


/**
 * Middleware de validation des entrées
 */
export const validateInput = (schema: any, requiredfields: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const missingFields = requiredfields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
          const response: JsonResponse = {
            success: false,
            message: 'Données d\'entrée manquantes',
            error: `Missing required fields: ${missingFields.join(', ')}`
          }
          res.status(400).json(response);
          return;
        }
    
        const result = schema.safeParse(req.body);
    
        if (!result.success) {
          const errors = result.error.errors.map((err: any) => 
            `${err.path.join('.')}: ${err.message}`
          ).join(', ');
      
          const response: JsonResponse = {
            success: false,
            message: 'Données d\'entrée invalides',
            error: errors
          }
          res.status(400).json(response);
          return;
        }
    
        req.body = result.data;
        next();
    };
};


const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb) {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});


const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedTypes = [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff',

    // Documents
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'application/rtf',

    // Archives & Compressed files
    'application/zip', 'application/x-rar-compressed',
    'application/x-7z-compressed', 'application/x-tar',

    // Vidéos
    'video/mp4', 'video/x-msvideo', 'video/x-matroska',
    'video/webm', 'video/quicktime',

    // Audios
    'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/aac', 'audio/webm'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté'));
  }
};

export const uploads = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 } // 10MB
});

export const exams = (field: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let files;
    if (req.file) files = req.file;
    if (req.files) files = req.files;

    if (!files) next();
    else {
      if (Array.isArray(files)) req.body[field] = files.map(file => req.protocol + '://' + req.get('host') + '/uploads/' + file.path);
      else req.body[field] = req.protocol + '://' + req.get('host') + '/uploads/' + files.path;
    }
    next();
  }
}

