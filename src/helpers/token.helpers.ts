import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_ALGORITHM = process.env.JWT_ALGORITHM as jwt.Algorithm || 'HS256';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in .env');
}

type Expiration = SignOptions['expiresIn'];

// Enhanced error types for better error handling
export class JWTError extends Error {
    constructor(message: string, public originalError?: any) {
        super(message);
        this.name = 'JWTError';
    }
}

export interface TokenResult<T = JwtPayload | string> {
    success: boolean;
    data?: T;
    error?: string;
}

// Generate JWT token with better error handling
export const generateToken = (
    payload: string | Buffer | object,
    expiresIn?: Expiration,
    options?: Omit<SignOptions, 'expiresIn'>
): TokenResult<string> => {
    try {
        const signOptions: SignOptions = {
            algorithm: JWT_ALGORITHM,
            ...options
        };
        
        if (expiresIn) {
            signOptions.expiresIn = expiresIn;
        }

        const token = jwt.sign(payload, JWT_SECRET, signOptions);
        return { success: true, data: token };
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('JWT generation error:', err);
        return { success: false, error: errorMessage };
    }
};

// Verify JWT token with detailed error information
export const verifyToken = (
    token: string,
    options?: VerifyOptions
): TokenResult<JwtPayload | string> => {
    try {
        const verifyOptions: VerifyOptions = {
            algorithms: [JWT_ALGORITHM],
            ...options
        };
        
        const decoded = jwt.verify(token, JWT_SECRET, verifyOptions);
        return { success: true, data: decoded };
    } catch (err) {
        let errorMessage = 'Token verification failed';
        
        if (err instanceof jwt.TokenExpiredError) {
            errorMessage = 'Token has expired';
        } else if (err instanceof jwt.JsonWebTokenError) {
            errorMessage = 'Invalid token';
        } else if (err instanceof jwt.NotBeforeError) {
            errorMessage = 'Token not active';
        }
        
        console.error('JWT verification error:', err);
        return { success: false, error: errorMessage };
    }
};

// Extract and verify token from Express request
export const decodeTokenFromRequest = (
    req: Request,
    options?: VerifyOptions
): TokenResult<JwtPayload | string> => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { success: false, error: 'Authorization header missing or invalid format' };
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            return { success: false, error: 'Token missing from authorization header' };
        }

        return verifyToken(token, options);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('JWT decode error:', err);
        return { success: false, error: errorMessage };
    }
};
