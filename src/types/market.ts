import { Types } from 'mongoose';
import { z } from 'zod';


const Price = z.object({
    min: z.number().min(0),
    max: z.number().min(1)
})

const Items = z.object({
    product: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    quantity: z.number().min(1),
    price: z.number()
})

const Delivery = z.object({
    internal: z.number().min(0),
    external: z.number().min(0),
    service: z.string()
})

const Ship = z.object({
    when: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date()
    ),
    where: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date()
    ),
    fee: z.number()
})

export const _XsAccount = z.object({
    owner: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    currency: z.string().optional()
})
export type XsAccount = z.infer<typeof _XsAccount>

export const _RSAccount = z.object({
    owner: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    currency: z.string().optional(),
    balance: z.number().min(0).optional()
})
export type RsAccount = z.infer<typeof _RSAccount>

export const _XsOrder = z.object({
    lead: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    sellor: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    items: z.array(Items),
    shipment: Ship.optional()
})
export type XsOrder = z.infer<typeof _XsOrder>

export const _RsOrder = z.object({
    lead: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    sellor: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    price: z.number().optional(),
    fees: z.number().optional(),
    total: z.number().optional(),
    items: z.array(Items).optional(),
    shipment: Ship.optional()
})
export type RsOrder = z.infer<typeof _RsOrder>

export const _XsProduct = z.object({
    assign: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    name: z.string(),
    description: z.string().optional(),
    price: Price,
    stock: z.number().min(0),
    category: z.string().optional(),
    media: z.array(z.string()),
    brand: z.string(),
    features: z.array(z.string()),
    address: z.string(),
    sizes: z.array(z.string()),
    colors: z.array(z.string()),
    delivery: Delivery,
    warranty: z.string(),
    bonus: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    )
})
export type XsProduct = z.infer<typeof _XsProduct>

export const _RsProduct = z.object({
    assign: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    name: z.string().optional(),
    description: z.string().optional(),
    price: Price.optional(),
    stock: z.number().min(0).optional(),
    category: z.string().optional(),
    media: z.array(z.string()).optional(),
    brand: z.string().optional(),
    features: z.array(z.string()).optional(),
    address: z.string().optional(),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    delivery: Delivery.optional(),
    warranty: z.string().optional(),
    bonus: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
})
export type RsProduct = z.infer<typeof _RsProduct>

export const _XsReview = z.object({
    lead: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    product: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    rating: z.number().min(1).max(5)
})
export type XsReview = z.infer<typeof _XsReview>

export const _RsReview = z.object({
    lead: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    product: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    rating: z.number().min(1).max(5).optional()
})
export type RsReview = z.infer<typeof _RsReview>

export const _XsRate = z.object({
    base: z.string(),
    target: z.string(),
    rate: z.number(),
    provider: z.string(),
    fectchedAt: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date()
    )
})
export type XsRate = z.infer<typeof _XsRate>

export const _RsRate = z.object({
    base: z.string().optional(),
    target: z.string().optional(),
    rate: z.number().optional(),
    provider: z.string().optional(),
    fectchedAt: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
})
export type RsRate = z.infer<typeof _RsRate>

export const _XsTrans = z.object({
    account: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    type: z.enum(['deposit', 'withdrawal', 'transfer', 'payment', 'refund']),
    amount: z.number(),
    curreny: z.string(),
    baseCurrency: z.string().optional(),
    exchangerate: z.number(),
    status: z.enum(['pending', 'completed', 'failed', 'cancelled']),
    description: z.string(),
    from: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    to: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    metadata: z.any()
})
export type XsTrans = z.infer<typeof _XsTrans>

export const _RsTrans = z.object({
    account: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    type: z.enum(['deposit', 'withdrawal', 'transfer', 'payment', 'refund']).optional(),
    amount: z.number().optional(),
    curreny: z.string().optional(),
    baseCurrency: z.string().optional(),
    exchangerate: z.number().optional(),
    status: z.enum(['pending', 'completed', 'failed', 'cancelled']).optional(),
    description: z.string().optional(),
    from: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    to: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    metadata: z.any(),
    processedAt: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
})
export type RsTrans = z.infer<typeof _RsTrans>
