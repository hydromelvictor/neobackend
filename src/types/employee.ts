import { z } from 'zod';
import { PasswordHash } from './commun.users';
import { Types } from 'mongoose';


const TemCreate = z.object({
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    fullname: z.string(),
    email: z.string().email(),
    password: PasswordHash,
    phone: z.string()
});

const TemUpdate = z.object({
    fullname: z.string().optional(),
    email: z.string().email().optional(),
    password: PasswordHash.optional(),
    phone: z.string().optional(),
    picture: z.string().optional()
});

export { TemCreate, TemUpdate };
