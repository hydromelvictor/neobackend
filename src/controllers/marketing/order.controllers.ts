import { Request, Response } from "express";
import { JsonResponse } from "../../types/api";
import Order from '../../models/marketing/order.models';


export default class OrderController {
    public static filter(q: any): any {
        const filter: any = {};

        if (q.idx) filter.$or = [
            { lead: q.idx },
            { assign: q.idx },
        ];
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
            const order = new Order({ ...req.body, lead: req.user._id, assign: req.params.id });
            await order.save();

            const response: JsonResponse = {
                success: true,
                message: 'order register suyccess',
                data: order
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
            const order = await Order.findById(req.params.id);
            if (!order) throw new Error('order not found');

            const response: JsonResponse = {
                success: true,
                message: 'order retrieved',
                data: order
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
            const filter = OrderController.filter(req.query);
            const options = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                sort: { createdAt: -1 }
            };

            const orders = await Order.paginate(filter, options);
            const response: JsonResponse = {
                success: true,
                message: 'orders retrieved',
                data: orders
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

    public static async update(req: Request, res: Response) {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) throw new Error('order not found');

            order.set(req.body);
            await order.save();
            const response: JsonResponse = {
                success: true,
                message: 'order updated',
                data: order
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

    public static async delete(req: Request, res: Response) {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) throw new Error('order not found');

            await order.deleteOne();
            const response: JsonResponse = {
                success: true,
                message: 'order deleted'
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

    public static async count(req: Request, res: Response) {
        try {
            const filter = OrderController.filter(req.query);
            const count = await Order.countDocuments(filter);
            const response: JsonResponse = {
                success: true,
                message: 'order count retrieved',
                data: count
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
}
