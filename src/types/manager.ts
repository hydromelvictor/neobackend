import { z } from 'zod';
import { PasswordHash } from './commun.users';

// Schema for creation (required fields)
const TmanCreate = z.object({
    firstname: z.string().min(3).max(20),
    lastname: z.string().min(3).max(20),
    email: z.string().email(),
    phone: z.string().min(10).max(15),
    position: z.string().min(3).max(20)
});

// Schema for updates (all fields optional)
const TmanUpdate = z.object({
    firstname: z.string().min(3).max(20).optional(),
    lastname: z.string().min(3).max(20).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15).optional(),
    picture: z.string().optional(),
    position: z.string().min(3).max(20).optional(),
    password: PasswordHash.optional()
});


export { TmanCreate, TmanUpdate };
