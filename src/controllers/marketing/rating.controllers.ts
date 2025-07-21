import { Request, Response } from "express";
import { JsonResponse } from "../../types/api";
import Rating from "../../models/marketing/rating.models";

export default class RatingController {
    public static filters(q: any): any {
        const filter: any = {};
        if (q.me) {
            filter.$or = [
                { lead: q.me },
                { product: q.me },
            ];
        }
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
            const rating = new Rating({ ...req.body, product: req.params.id, lead: req.user._id });
            await rating.save();

            const response: JsonResponse = {
                success: true,
                message: 'rating registered',
                data: rating
            }
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };
        
            res.status(500).json(response);
        }
    }

    public static async retrieve(req: Request, res: Response) {
        try {
            const rating = await Rating.findById(req.params.id);
            if (!rating) throw new Error('rating not found');

            const response: JsonResponse = {
                success: true,
                message: 'rating retrieved',
                data: rating
            }
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };
        
            res.status(500).json(response);
        }
    }

    public static async retrieveProduct(req: Request, res: Response) {
        try {
            const rating = await Rating.find({ product: req.params.id });
            if (!rating) throw new Error('rating not found');

            const rate = rating.reduce((acc, cur) => acc + cur.rating, 0) / rating.length;
            const response: JsonResponse = {
                success: true,
                message: 'rating retrieved',
                data: rate
            }
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };
        
            res.status(500).json(response);
        }
    }

    public static async list(req: Request, res: Response) {
        try {
            const filter = RatingController.filters(req.query);
            const options = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                sort: { createdAt: -1 }
            };

            const ratings = await Rating.paginate(filter, options);
            const response: JsonResponse = {
                success: true,
                message: 'ratings retrieved',
                data: ratings
            }
            res.status(200).json(response);
        } catch (err: any) {
            console.error('Erreur lors de la validation du code:', err);
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: err.message
            };
        
            res.status(500).json(response);
        }
    }

    public static async count(req: Request, res: Response) {
        try {
            const filter = RatingController.filters(req.query);
            const count = await Rating.countDocuments(filter);
            const response: JsonResponse = {
                success: true,
                message: 'rating count retrieved',
                data: count
            }
            res.status(200).json(response);
        } catch (err: any) {
            console.error('Erreur lors de la validation du code:', err);
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: err.message
            };
        
            res.status(500).json(response);
        }
    }
}
