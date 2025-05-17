import { Types } from 'mongoose';
import { number, z } from 'zod';

const MapLocat = z.object({
    country: z.string(),
    city: z.string(),
    region: z.string(),
    lat: z.number(),
    lon: z.number()
})

const View = z.object({
    size: number(),
    interested: number()
})

export const _XsDevice = z.object({
    hote: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    sessionId: z.string(),
    instantId: z.string(),
    type: z.string(),
    method: z.string(),
    ip: z.string(),
    userAgent: z.string(),
    browser: z.string().optional(),
    os: z.string(),
    location: MapLocat.optional(),
    metadata: z.any()
})
export type XsDevice = z.infer<typeof _XsDevice>

export const _RsDevice = z.object({
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    hote: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    sessionId: z.string().optional(),
    instantId: z.string().optional(),
    type: z.string().optional(),
    method: z.string().optional(),
    ip: z.string().optional(),
    userAgent: z.string().optional(),
    browser: z.string().optional(),
    os: z.string(),
    location: MapLocat.optional(),
    metadata: z.any().optional(),
    before: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
    after: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    )
})
export type RsDevice = z.infer<typeof _RsDevice>

export const _XsAnnonce = z.object({
    state: z.enum(['flottant', 'avatar', 'push']),
    image: z.string().optional(),
    name: z.string(),
    path: z.string(),
    target: z.string(),
    message: z.string(),
    expired: z.date(),
    status: z.enum(['pending', 'running', 'pass']).optional(),
    view: View
})
export type XsAnnonce = z.infer<typeof _XsAnnonce>

export const _RsAnnonce = z.object({
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    state: z.enum(['flottant', 'avatar', 'push']),
    image: z.string().optional(),
    name: z.string().optional(),
    path: z.string().optional(),
    target: z.string().optional(),
    message: z.string().optional(),
    expired: z.date().optional(),
    status: z.enum(['pending', 'running', 'pass']).optional(),
    view: View.optional(),
    before: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
    after: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    )
})
export type RsAnnonce = z.infer<typeof _RsAnnonce>
