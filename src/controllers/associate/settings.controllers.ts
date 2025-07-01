import { Request, Response } from 'express';
import { JsonResponse } from '../../types/api';
import Settings from '../../models/associate/settings.models';


export default class SettingsController {
    public static filters(q: any): any {
        const filter: any = {};

        if (q.lang) filter.lang = q.lang;
        if (q.currency) filter.currency = q.currency;
        if (q.country) filter.country = q.country;

        return filter;
    }

    public static async retrieve(req: Request, res: Response) {
        try {
            const settings = await Settings.findById(req.params.id);
            if (!settings) throw new Error('settings not found');

            const response: JsonResponse = {
                success: true,
                message: 'settings read',
                data: settings
            }
            res.status(200).json(response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'Erreur du server',
                error: err.message
            }
            res.status(500).json(response)
        }
    }

    public static async list(req: Request, res: Response) {
        try {
            const filter = SettingsController.filters(req.query);
            const options = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                sort: { createdAt: -1 }
            }
            const settings = await Settings.paginate(filter, options);
            const response: JsonResponse = {
                success: true,
                message: 'settings read',
                data: settings
            }
            res.status(200).json(response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'Erreur du server',
                error: err.message
            }
            res.status(500).json(response)
        }
    }

    public static async update(req: Request, res: Response) {
        try {
            const settings = await Settings.findById(req.params.id);
            if (!settings) throw new Error('settings not found');

            Object.assign(settings, req.body);
            await settings.save();

            const response: JsonResponse = {
                success: true,
                message: 'settings updated',
                data: settings
            }
            res.status(200).json(response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'Erreur du server',
                error: err.message
            }
            res.status(500).json(response)
        }
    }
    

    public static async delete(req: Request, res: Response) {
        try {
            const settings = await Settings.findById(req.params.id);
            if (!settings) throw new Error('settings not found');

            await settings.deleteOne();

            const response: JsonResponse = {
                success: true,
                message: 'settings deleted'
            }
            res.status(200).json(response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'Erreur du server',
                error: err.message
            }
            res.status(500).json(response)
        }
    }
}
