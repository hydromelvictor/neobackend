import { Types } from 'mongoose';
import { z } from 'zod';

// Password
// Minimum 8 caractères
// Au moins une lettre majuscule
// Au moins une lettre minuscule
// Au moins un chiffre
// Au moins un caractère spécial

const PasswordHash = z
    .string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères")
    .refine((val) => /[a-z]/.test(val), {
        message: "Le mot de passe doit contenir une lettre minuscule",
    })
    .refine((val) => /[A-Z]/.test(val), {
        message: "Le mot de passe doit contenir une lettre majuscule",
    })
    .refine((val) => /[0-9]/.test(val), {
        message: "Le mot de passe doit contenir un chiffre",
    })
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
        message: "Le mot de passe doit contenir un caractère spécial",
    });

const GeoJSONPointSchema = z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([
        z.number().min(-180).max(180), // longitude
        z.number().min(-90).max(90),   // latitude
    ]),
});

export const _XsAdmin = z.object({
    firstname: z.string(),
    lastname: z.string(),
    phone: z.string(),
    email: z.string().email(),
    cni: z.string(),
    position: z.string().optional(),
})
export type XsAdmin = z.infer<typeof _XsAdmin>

export const _RsAdmin = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    picture: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    cni: z.string().optional(),
    position: z.string().optional()
})
export type RsAdmin = z.infer<typeof _RsAdmin>


export const _XsLead = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    picture: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional()
})
export type XsLead = z.infer<typeof _XsLead>


export const _XsMember = z.object({
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    phone: z.string(),
    position: z.string(),
    password: PasswordHash,
    authority: z.boolean().optional()
})
export type XsMember = z.infer<typeof _XsMember>

export const _RsMember = z.object({
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    position: z.string().optional(),
    picture: z.string().optional(),
    password: PasswordHash.optional()
})
export type RsMember = z.infer<typeof _RsMember>

export const _XsMentor = z.object({
    firstname: z.string(),
    lastname: z.string(),
    country: z.string(),
    city: z.string(),
    position: z.string(),
    phone: z.string(),
    email: z.string().email()
})
export type XsMentor = z.infer<typeof _XsMentor>

export const _RsMentor = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    position: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    picture: z.string().optional(),
    password: PasswordHash.optional(),
    codecs: z.string().optional(),
    referClick:  z.number().min(0).optional()
})
export type RsMentor = z.infer<typeof _RsMentor>

export const _XsOrg = z.object({
    reason: z.string(),
    mentor: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    social: z.string(),
    country: z.string(),
    state: z.string(),
    address: z.string(),
    location: GeoJSONPointSchema,
    phone: z.string(),
    email: z.string().email(),
    sector: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    service: z.string(),
    area: z.string(),
})
export type Xsorg = z.infer<typeof _XsOrg>

export const _RsOrg = z.object({
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    reason: z.string().optional(),
    mentor: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    social: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    address: z.string().optional(),
    location: GeoJSONPointSchema.optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    sector: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    service: z.string().optional(),
    area: z.string().optional(),
    picture: z.string().optional()
})
export type RsOrg = z.infer<typeof _RsOrg>
