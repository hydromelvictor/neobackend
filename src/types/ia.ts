import { Types } from 'mongoose';
import { z } from 'zod';

const TneoCreate = z.object({
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    fullname: z.string(),
    picture: z.string().optional(),
    responsability: z.string(),
    sex: z.enum(['M', 'F']),
    mission: z.string(),
    context: z.string(),
    task: z.array(z.string()),
    version: z.string()
});

const TneoUpdate = z.object({
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    fullname: z.string().optional(),
    picture: z.string().optional(),
    responsability: z.string().optional(),
    sex: z.enum(['M', 'F']).optional(),
    mission: z.string().optional(),
    context: z.string().optional(),
    task: z.array(z.string()).optional(),
    version: z.string().optional()
})

export { TneoCreate, TneoUpdate };
