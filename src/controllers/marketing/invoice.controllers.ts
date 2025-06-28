import { Request, Response } from 'express';
import Tracking from '../../models/marketing/invoice.models';
import { JsonResponse } from '../../types/api';


export default class TrackingController {
    public static filters = (q: any): any => {
        const query: any = {};

        if (q.status) query.type = q.status;
        if (q.min) query.amount.$gte = parseFloat(q.min);
        if (q.max) query.amount.$lte = parseFloat(q.max);
        if (q.currency) query.currency = q.currency;
        if (q.effect) query.status = q.effect;
        if (q.from) query.from = q.from;
        if (q.to) query.to = q.to;
        if (q.after) {
            const now = new Date(q.after);
            now.setHours(0, 0, 0, 0);
            query.createdAt = { $gte: now };
        }
        if (q.before) {
            const now = new Date(q.before);
            now.setHours(0, 0, 0, 0);
            query.createdAt = { $lte: now };
        }

        return query;
    }

    public static async retrieve(req: Request, res: Response) {
        try {
            const tracking = await Tracking.findById(req.params.id);
            if (!tracking) throw new Error('Tracking not found');

            const response: JsonResponse = {
                success: true,
                message: 'Tracking retrieved successfully',
                data: tracking
            };
            res.status(200).json(response);

        } catch (error: any) {
            const response: JsonResponse = {
                success: false,
                message: 'Something went wrong',
                error: error.message
            };
            res.status(500).json(response);
        }
    }

    public static async list(req: Request, res: Response) {
        try {
            const filter = TrackingController.filters(req.query);
            const options = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                sort: { createdAt: -1 }
            };

            const tracking = await Tracking.paginate(filter, options);
            const response: JsonResponse = {
                success: true,
                message: 'Tracking retrieved successfully',
                data: tracking
            };
            res.status(200).json(response);
        } catch (error: any) {
            const response: JsonResponse = {
                success: false,
                message: 'Something went wrong',
                error: error.message
            };
            res.status(500).json(response);
        }
    }

    public static async count(req: Request, res: Response) {
        try {
            const filter = TrackingController.filters(req.query);
            const count = await Tracking.countDocuments(filter);
            const response: JsonResponse = {
                success: true,
                message: 'Tracking count retrieved successfully',
                data: count
            };
            res.status(200).json(response);
        } catch (error: any) {
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };

            res.status(500).json(response);
        }
    }
}
