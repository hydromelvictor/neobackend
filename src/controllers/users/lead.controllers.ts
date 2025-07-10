import { Request, Response } from 'express';
import Lead from '../../models/users/lead.models';
import { JsonResponse } from '../../types/api';


export default class LeadController {
    public static filters(q: any): any {
        const filter: any = {};

        if (q.name) {
            const regex = { $regex: q.name, $options: 'i' };
            filter.$or = [
                { firstname: regex },
                { lastname: regex },
                { address: regex }
            ]
        }
        if (q.online) filter.online = q.online === 'true';
        if (q.auth) filter.isAuthenticated = q.auth === 'true';
        if (q.after) {
            const now = new Date(q.after);
            now.setHours(0, 0, 0, 0);
            filter.createdAt = { $gte: now };
        }
        if (q.before) {
            const now = new Date(q.before);
            now.setHours(0, 0, 0, 0);
            filter.createdAt = { $lte: now };
        }
        return filter;
    }

    public static async register(req: Request, res: Response) {
        try {
            const lead = new Lead();
            lead.online = true;
            lead.isAuthenticated = true;
            lead.disconnected = '';
            
            await lead.save();
            const response: JsonResponse = {
                success: true,
                message: 'lead registered',
                data: lead
            }
            res.status(201).json(response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du server',
                error: err.message
            }
            res.status(500).json(response);
        }
    }

    public static async retrieve(req: Request, res: Response) {
        try {
            const lead = await Lead.findByPhone(req.params.id);
            if (!lead) throw new Error('lead not found');

            const response: JsonResponse = {
                success: true,
                message: 'lead found',
                data: lead
            }
            res.status(200).json(response);
        } catch (error: any) {
            const response: JsonResponse = {
                success: false,
                message: error.message
            }
            res.status(400).json(response);
        }
    }

    public static async list(req: Request, res: Response) {
        try {
            const filter = LeadController.filters(req.query);
            const options = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                sort: { createdAt: -1 }
            }
            const leads = await Lead.paginate(filter, options);
            const response: JsonResponse = {
                success: true,
                message: 'leads found',
                data: leads
            }
            res.status(200).json(response);
        } catch (error: any) {
            const response: JsonResponse = {
                success: false,
                message: error.message
            }
            res.status(400).json(response);
        }
    }

    public static async update(req: Request, res: Response) {
        try {
            const lead = await Lead.findByPhone(req.params.id);
            if (!lead) throw new Error('lead not found');

            const phone = req.body.phone;
            const exist = await Lead.findByPhone(phone);
            if (exist && exist._id.toString() !== lead._id.toString()) throw new Error('lead already exists');

            Object.assign(lead, req.body);
            await lead.save();

            const response: JsonResponse = {
                success: true,
                message: 'lead updated',
                data: lead
            }
            res.status(200).json(response);
        } catch (error: any) {
            const response: JsonResponse = {
                success: false,
                message: error.message
            }
            res.status(400).json(response);
        }
    }

    public static async count(req: Request, res: Response) {
        try {
            const filter = LeadController.filters(req.query);
            const count = await Lead.countDocuments(filter);
            const response: JsonResponse = {
                success: true,
                message: 'leads count',
                data: count
            }
            res.status(200).json(response);
        } catch (error: any) {
            const response: JsonResponse = {
                success: false,
                message: error.message
            }
            res.status(400).json(response);
        }
    }
}
