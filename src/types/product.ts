import { z } from 'zod';
import { Types } from 'mongoose';

const TprdCreate = z.object({
    assign: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    name: z.string(),
    description: z.string(),
    price: z.array(z.number()),
    stock: z.number(),
    category: z.string(),
    media: z.array(z.string()),
    brand: z.string(),
    features: z.array(z.string()),
    address: z.string(),
    sizes: z.array(z.string()),
    colors: z.array(z.string()),
    delivery: z.object({
        in: z.number(),
        out: z.number()
    }),
    ondemand: z.string(),
    warranty: z.string(),
    bonus: z.array(z.string()).optional()
})

const TprdUpdate = z.object({
    assign: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.array(z.number()).optional(),
    stock: z.number().optional(),
    category: z.string().optional(),
    media: z.array(z.string()).optional(),
    brand: z.string().optional(),
    features: z.array(z.string()).optional(),
    address: z.string().optional(),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    delivery: z.object({
        in: z.number(),
        out: z.number()
    }).optional(),
    ondemand: z.string().optional(),
    warranty: z.string().optional(),
    bonus: z.array(z.string()).optional()
})

export { TprdCreate, TprdUpdate };