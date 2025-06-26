import { z } from 'zod';
import { PasswordHash } from './commun.users';

const TrefCreate = z.object({
    fullname: z.string(),
    email: z.string().email(),
    position: z.string(),
    country: z.string(),
    city: z.string(),
    phone: z.string()
})

const TrefUpdate = z.object({
    fullname: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    position: z.string().optional(),
    phone: z.string().optional(),
    picture: z.string().optional(),
    password: PasswordHash.optional(),
    email: z.string().email().optional(),
    promo: z.string().optional()
})

export { TrefCreate, TrefUpdate };
