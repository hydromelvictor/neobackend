import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in .env');
}

type Expiration = SignOptions['expiresIn'];

export const generateToken = async (
    payload: string | Buffer | object,
    expiresIn?: Expiration
): Promise<string | null> => {
    try {
        const options: SignOptions = {};
        if (expiresIn) {
            options.expiresIn = expiresIn;
        }

        const token = jwt.sign(payload, JWT_SECRET, options);
        return token;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const verifyToken = async (token: string): Promise<JwtPayload | string | null> => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        console.error('JWT verification error:', err);
        return null;
    }
};

export const decodeToken = async (req: Request): Promise<JwtPayload | string | null> => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
        
        const token = authHeader.split(' ')[1];
        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        console.error('JWT decode error:', err);
        return null;
    }
};
