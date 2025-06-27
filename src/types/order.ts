import { z } from 'zod';
import { Types } from 'mongoose';

const item = z.object({
    product: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    quantity: z.number(),
    price: z.number()
})

const ship = z.object({
    when: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date()
    ),
    where: z.string(),
    fee: z.number()
})

const TordCreate = z.object({
    lead: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    items: z.array(item),
    shipment: ship.optional()
})

const TordUpdate = z.object({
    items: z.array(item),
    shipment: ship.optional()
})

export { TordCreate, TordUpdate };
