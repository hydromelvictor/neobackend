import { Types, Schema } from 'mongoose';
import { z } from 'zod';


// ORG
const GeoJSONPointSchema = z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([
        z.number().min(-180).max(180), // longitude
        z.number().min(-90).max(90),   // latitude
    ]),
});

export const OrgRegisterSchema = z.object({
    reason: z.string(),
    mentor: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    social: z.string(),
    country: z.string(),
    state: z.string(),
    address: z.string(),
    location: GeoJSONPointSchema
})
export type SignUpDataOrgRegister = z.infer<typeof OrgRegisterSchema>;

export const OrgLoadingSchema = z.object({
    phone: z.array(z.string()),
    email: z.string().email(),
    sector: z.string(),
    service: z.string(),
})
export type SignUpDataOrgLoading = z.infer<typeof OrgLoadingSchema>

export const SingleOrgSchema = z.object({
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    reason: z.string().optional(),
    mentor: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    social: z.enum([
        'SNC', 'SCS', 'SA', 'SAS', 'SASU', 'SARL', 'EURL',
        'SCOP', 'SCIC', 'EI', 'EIRL', 'Micro-entreprise',
        'SEP', 'GIE', 'SCI/SCP/...',
    ]).optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    address: z.string().optional(),
    location: GeoJSONPointSchema.optional(),
    phone: z.array(z.string()).optional(),
    email: z.string().email().optional(),
    sector: z.string().optional(),
    service: z.string().optional(),
    area: z.string().optional(),
    picture: z.string().optional()
})
export type SingleOrg = z.infer<typeof SingleOrgSchema>

export const ManyOrgSchema = z.object({
    reason: z.string().optional(),
    mentor: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    social: z.enum([
        'SNC', 'SCS', 'SA', 'SAS', 'SASU', 'SARL', 'EURL',
        'SCOP', 'SCIC', 'EI', 'EIRL', 'Micro-entreprise',
        'SEP', 'GIE', 'SCI/SCP/...',
    ]).optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    lon: z.number().optional(),
    lat: z.number().optional(),
    sector: z.string().optional(),
    service: z.string().optional(),
    area: z.string().optional(),
    before: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
    after: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
})
export type ManyOrg = z.infer<typeof ManyOrgSchema>

//  Member

export const MemberRegisterSchema = z.object({
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId)
    ),
    firstname: z.string(),
    lastname: z.string(),
    phone: z.string(),
    username: z.string(),
    position: z.string(),
    password: z.string()
})
export type MemberRegister = z.infer<typeof MemberRegisterSchema>

export const MemberLoginSchema = z.object({
    username: z.string(),
    password: z.string()
})
export type MemberLogin = z.infer<typeof MemberLoginSchema>

export const SingleMemberSchema = z.object({
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    username: z.string().optional(),
    phone: z.string().optional(),
    position: z.string().optional(),
    picture: z.string().optional(),
    password: z.string().optional(),
    online: z.boolean().optional(),
    is_authenticated: z.boolean().optional(),
    staff: z.boolean().optional(),
})
export type SingleMember = z.infer<typeof SingleMemberSchema>

export const ManyMemberSchema = z.object({
    org: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    name: z.string().optional(),
    position: z.string().optional(),
    online: z.boolean().optional(),
    is_authenticated: z.boolean().optional(),
    staff: z.boolean().optional(),
    before: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
    after: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
})
export type ManyMember = z.infer<typeof ManyMemberSchema>

// ADMIN

export const SignAdminSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string(),
})
export type SignAdmin = z.infer<typeof SignAdminSchema>

export const SingleAdminSchema = z.object({
    //_id: z.string().optional(),
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    phone: z.array(z.string()).optional(),
    email: z.string().email().optional(),
    cni: z.string().optional(),
    position: z.string().optional(),
    online: z.boolean().optional(),
    is_authenticated: z.boolean().optional(),
    staff: z.boolean().optional(),
})
export type SingleAdmin = z.infer<typeof SingleAdminSchema>

export const ManyAdminSchema = z.object({
    letter: z.string().optional(),
    name: z.string().optional(),
    cni: z.string().optional(),
    position: z.string().optional(),
    online: z.boolean().optional(),
    is_authenticated: z.boolean().optional(),
    staff: z.boolean().optional(),
})
export type ManyAdmin = z.infer<typeof ManyAdminSchema>


export const SingleLeadSchema = z.object({
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    phone: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    picture: z.string().optional(),
    online: z.boolean().optional(),
    is_authenticated: z.boolean().optional(),
    staff: z.boolean().optional(),
    address: z.string().optional()
})
export type SingleLead = z.infer<typeof SingleLeadSchema>

export const ManyLeadSchema = z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    online: z.boolean().optional(),
    is_authenticated: z.boolean().optional(),
    staff: z.boolean().optional(),
    before: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
    after: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
})
export type ManyLead = z.infer<typeof ManyLeadSchema>

// MENTOR
export const SignMentorSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    phone: z.string(),
    email: z.string().email(),
    position: z.string(),
    country: z.string(),
    city: z.string(),
})
export type SignMentor = z.infer<typeof SignMentorSchema>

export const SingleMentorSchema = z.object({
    _id: z.preprocess(
        (val) => (typeof val === 'string' && Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val),
        z.instanceof(Types.ObjectId).optional()
    ),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    position: z.string().optional(),
    picture: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    online: z.boolean().optional(),
    is_authenticated: z.boolean().optional(),
    staff: z.boolean().optional(),
    referClick: z.number().optional()
})
export type SingleMentor = z.infer<typeof SingleMentorSchema>

export const ManyMentorSchema = z.object({
    letter: z.string().optional(),
    name: z.string().optional(),
    state: z.string().optional(),
    position: z.string().optional(),
    online: z.boolean().optional(),
    is_authenticated: z.boolean().optional(),
    staff: z.boolean().optional(),
    before: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
    after: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date().optional()
    ),
})
export type ManyMentor = z.infer<typeof ManyMentorSchema>
