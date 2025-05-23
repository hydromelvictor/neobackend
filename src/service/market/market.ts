import { Types } from 'mongoose';
import { z } from 'zod';

// ACCOUNT

export const XrAccountSchema = z.object({
    owner: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
})
export type XrAccount = z.infer<typeof XrAccountSchema>

export const RsAccountSchema = z.object({
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    owner: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    )
})
export type RsAccount = z.infer<typeof RsAccountSchema>

export const RmAccountSchema = z.object({
    min: z.number().optional(),
    max: z.number().optional()
})
export type RmAccount = z.infer<typeof RmAccountSchema>

// ORDER - ITEMS

const Items = z.object({
    product: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    quantity: z.number().min(1),
    price: z.number()
})

const Ship = z.object({
    when: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date()
    ),
    where: z.string(),
    fee: z.number()
})

export const XrOrderSchema = z.object({
    lead: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    sellor: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    price: z.number(),
    fees: z.number(),
    total: z.number(),
    items: Items,
    shipment: Ship.optional()
})
export type XrOrder = z.infer<typeof XrOrderSchema>

export const RsOrderSchema = z.object({
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    lead: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    )
})
export type RsOrder = z.infer<typeof RsOrderSchema>

export const RmOrderSchema = z.object({
    lead: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    sellor: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    sub: z.number().optional(),
    sup: z.number().optional()
})
export type RmOrder = z.infer<typeof RmOrderSchema>

// PRODUCT

const Price = z.object({
    normal: z.number(),
    discount: z.number()
})

const Delivery = z.object({
    internal: z.number(),
    external: z.number(),
    service: z.string(),
})

export const XrProductSchema = z.object({
    assign: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    name: z.string(),
    description: z.string().optional(),
    price: Price,
    stock: z.number(),
    category: z.string(),
    media: z.array(z.string()),
    brand: z.string().optional(),
    features: z.array(z.string()).optional(),
    address: z.string().optional(),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    delivery: Delivery.optional(),
    warranty: z.number(),
    bonus: z.array(z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ))
})
export type XrProduct = z.infer<typeof XrProductSchema>

export const RsProductSchema = z.object({
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
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
    category: z.string().optional(),
    address: z.string().optional(),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    brand: z.string().optional(),
    warranty: z.number().optional()
})
export type RsProduct = z.infer<typeof RsProductSchema>

export const RmProductSchema = z.object({
    assign: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    min: z.number(),
    max: z.number(),
    name: z.string(),
    description: z.string().optional(),
    category: z.string(),
    address: z.string().optional(),
    size: z.string().optional(),
    color: z.string().optional(),
    brand: z.string().optional(),
    before: z.number(),
    after: z.number()
})
export type RmProduct = z.infer<typeof RmProductSchema>

// REVIEW

export const XrReviewSchema = z.object({
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
export type XrReview = z.infer<typeof XrReviewSchema>

export const RsReviewSchema = z.object({
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    lead: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    product: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    )
})
export type RsReview = z.infer<typeof RsReviewSchema>

export const RmReviewSchema = z.object({
    lead: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    product: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    max: z.number().min(1).max(5).optional(),
    min: z.number().min(1).max(5).optional()
})
export type RmReview = z.infer<typeof RmReviewSchema>

// TRANSACTION
export const XrTranSchema = z.object({
    account: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    type: z.enum(['deposit', 'withdrawal', 'transfer', 'payment', 'refund']),
    amount: z.string(),
    currency: z.string(),
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
    metadata: z.any().optional(),
    processedAt: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    )
})
export type XrTrans = z.infer<typeof XrTranSchema>

export const RsTranSchema = z.object({
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    account: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    type: z.enum(['deposit', 'withdrawal', 'transfer', 'payment', 'refund']).optional(),
    status: z.enum(['pending', 'completed', 'failed', 'cancelled']).optional(),
    description: z.string().optional(),
    processedAt: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    )
})
export type RsTrans = z.infer<typeof RsTranSchema>

export const RmTranSchema = z.object({
    account: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    type: z.enum(['deposit', 'withdrawal', 'transfer', 'payment', 'refund']).optional(),
    min: z.string().optional(),
    max: z.string().optional(),
    status: z.enum(['pending', 'completed', 'failed', 'cancelled']).optional(),
    description: z.string().optional(),
    before: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
    after: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    )
})
export type RmTrans = z.infer<typeof RmTranSchema>
