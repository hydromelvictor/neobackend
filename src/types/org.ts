import { z } from 'zod';
import { Types } from 'mongoose';



const Locate = z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([
        z.number().min(-180).max(180), // longitude
        z.number().min(-90).max(90),   // latitude
    ]),
});

const TorgCreate = z.object({
    reason: z.string().min(3),
    manager: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    referer: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    social: z.enum(['SNC', 'SCS', 'SA', 'SAS', 'SASU', 'SARL', 'EURL', 'SCOP', 'SCIC', 'EI', 'EIRL', 'Micro-entreprise', 'SEP', 'GIE', 'SCI/SCP/...']),
    country: z.string().min(3),
    state: z.string().min(3),
    address: z.string().min(3),
    location: Locate,
    phone: z.array(z.string().min(3)),
    email: z.string().email(),
    sector: z.string().min(3),
    service: z.string().min(3),
    area: z.string().min(3).optional(),
    picture: z.string().optional()
});


const TorgUpdate = z.object({
    reason: z.string().min(3).optional(),
    social: z.enum(['SNC', 'SCS', 'SA', 'SAS', 'SASU', 'SARL', 'EURL', 'SCOP', 'SCIC', 'EI', 'EIRL', 'Micro-entreprise', 'SEP', 'GIE', 'SCI/SCP/...']),
    country: z.string().min(3).optional(),
    state: z.string().min(3).optional(),
    address: z.string().min(3).optional(),
    location: Locate.optional(),
    phone: z.array(z.string().min(3)).optional(),
    email: z.string().email().optional(),
    sector: z.string().min(3).optional(),
    service: z.string().min(3).optional(),
    area: z.string().min(3).optional(),
    picture: z.string().optional()
})

export { TorgCreate, TorgUpdate };
