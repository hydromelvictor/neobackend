import { Request, Response } from "express";
import { JsonResponse } from "../../types/api";
import Product from "../../models/marketing/product.models";

export default class ProductController {
    public static filters(q: any): any {
        const filter: any = {};

        filter.$or = []
        if (q.idx) {
            filter.$or.concat(
                { assign: q.idx },
                { org: q.idx }
            )
        }
        if (q.online) filter.online = q.online === 'true';
        if (q.name) {
            const regex = { regex: q.name, options: 'i' };
            filter.$or.concat(
                { name: regex },
                { description: regex },
                { brand: regex },
                { category: regex },
                { warranty: regex }
            )
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
            const org = req.params.id;
            const product = new Product({ ...req.body, org });
            await product.save();

            const response: JsonResponse = {
                success: false,
                message: 'product created',
                data: product
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
            const product = await Product.findById(req.params.id);
            if (!product) throw new Error('product not found');

            const response: JsonResponse = {
                success: true,
                message: 'product retrieved',
                data: product
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
            const filter = ProductController.filters(req.query);
            const options = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                sort: { createdAt: -1 }
            };

            const products = await Product.paginate(filter, options);
            const response: JsonResponse = {
                success: true,
                message: 'products retrieved',
                data: products
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
            const product = await Product.findById(req.params.id);
            if (!product) throw new Error('product not found');

            product.set(req.body);
            await product.save();

            const response: JsonResponse = {
                success: true,
                message: 'product updated',
                data: product
                }
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            }
            res.status(500).json(response);
        }
    }

    public static async delete(req: Request, res: Response) {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) throw new Error('product not found');

            await product.deleteOne();
            const response: JsonResponse = {
                success: true,
                message: 'product deleted'
            }
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            }
            res.status(500).json(response);
        }
    }

    public static async count(req: Request, res: Response) {
        try {
            const filter = ProductController.filters(req.query);
            const count = await Product.countDocuments(filter);

            const response: JsonResponse = {
                success: true,
                message: 'product count retrieved',
                data: count
            }
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la validation du code:', error);

            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            }
            res.status(500).json(response);
        }
    }
}
