import { Types } from 'mongoose';
import { z } from 'zod';

export const _XsIa = z.object({
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    fullname: z.string(),
    picture: z.string().optional(),
    responsability: z.string(),
    sex: z.string().min(1).max(1),
    role: z.string(),
    mission: z.string(),
    context: z.string(),
    task: z.string(),
    tools: z.string()
})
export type XsIa = z.infer<typeof _XsIa>

export const _RsIa = z.object({
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    fullname: z.string().optional(),
    picture: z.string().optional(),
    responsability: z.string().optional(),
    sex: z.string().min(1).max(1).optional(),
    role: z.string().optional(),
    mission: z.string().optional(),
    context: z.string().optional(),
    task: z.string().optional(),
    tools: z.string().optional(),
    version: z.string().optional(),
    before: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
    after: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
    online: z.boolean().optional()
})
export type RsIa = z.infer<typeof _RsIa>

export const _XsPrompt = z.object({
    ia: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    subject: z.string(),
    text: z.string()
})
export type XsPrompt = z.infer<typeof _XsPrompt>

export const _RsPrompt = z.object({
    id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    ia: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    subject: z.string().optional(),
    text: z.string().optional(),
    before: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
    after: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
})
export type RsPrompt = z.infer<typeof _RsPrompt>
