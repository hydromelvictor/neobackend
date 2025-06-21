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

// // Utility function to extract token without verification (for debugging)
// export const decodeTokenWithoutVerification = (token: string): TokenResult<JwtPayload | string> => {
//     try {
//         const decoded = jwt.decode(token);
//         if (!decoded) {
//             return { success: false, error: 'Failed to decode token' };
//         }
//         return { success: true, data: decoded };
//     } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
//         console.error('JWT decode error:', err);
//         return { success: false, error: errorMessage };
//     }
// };

// // Check if token is expired without verification
// export const isTokenExpired = (token: string): boolean => {
//     try {
//         const decoded = jwt.decode(token) as JwtPayload;
//         if (!decoded || !decoded.exp) return true;
        
//         const currentTime = Math.floor(Date.now() / 1000);
//         return decoded.exp < currentTime;
//     } catch {
//         return true;
//     }
// };

// // Extract payload type safely
// export const getTokenPayload = <T extends object>(
//     token: string
// ): TokenResult<T> => {
//     const result = verifyToken(token);
//     if (!result.success || !result.data) {
//         return { success: false, error: result.error };
//     }
    
//     return { success: true, data: result.data as T };
// };

// // Middleware helper for token validation
// export const createTokenMiddleware = (options?: VerifyOptions) => {
//     return (req: Request & { user?: any }, res: any, next: any) => {
//         const result = decodeTokenFromRequest(req, options);
        
//         if (!result.success) {
//             return res.status(401).json({ 
//                 error: 'Unauthorized', 
//                 message: result.error 
//             });
//         }
        
//         req.user = result.data;
//         next();
//     };
// };