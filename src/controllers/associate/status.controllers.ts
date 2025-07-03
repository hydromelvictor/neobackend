import { Request, Response } from 'express';
import { JsonResponse } from '../../types/api';
import Status from '../../models/associate/status.models';
import View from '../../models/associate/view.models';


export default class StatusController {
    public static async create(req: Request, res: Response) {
        try {
            const status = await Status.create({ org: req.params.id, ...req.body });
            const response: JsonResponse = {
                success: true,
                message: 'add status',
                data: status
            }
            req.io.emit('addStatus', response);
            res.status(200).send()
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'failed',
                error: err.message
            }
            res.status(400).json(response)
        }
    }

    public static async retrieve(req: Request, res: Response) {
        try {
            const status = await Status.findById(req.params.id);
            if (!status) throw new Error('not found');

            let view = await View.findOne({ status: req.params.id, viewer: req.user._id });
            if (!view)
                view = await View.create({ status: req.params.id, viewer: req.user._id });

            const views = await View.find({ status: req.params.id });
            const response: JsonResponse = {
                success: true,
                message: 'retrieve status',
                data: { ...status, views }
            }
            res.status(200).json(response)
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'failed',
                error: err.message
            }
            res.status(400).json(response)
        }
    }

    public static async list(req: Request, res: Response) {
        try {
            const filter: any = {};
            if (req.query.org) filter['org'] = req.query.org;

            const options: any = {
                page: req.query.page || 1,
                limit: req.query.limit || 10,
                sort: { createdAt: -1 }
            }
            const status = await Status.paginate(filter, options);
            const response: JsonResponse = {
                success: true,
                message: 'list status',
                data: status
            }
            res.status(200).json(response)
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'failed',
                error: err.message
            }
            res.status(400).json(response)
        }
    }

    public static async delete(req: Request, res: Response) {
        try {
            const status = await Status.findById(req.params.id);
            if (!status) throw new Error('not found');

            await status.deleteOne();
            const response: JsonResponse = {
                success: true,
                message: 'delete status',
                data: status
            }
            req.io.emit('deleteStatus', response);
            res.status(200).send()
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'failed',
                error: err.message
            }
            res.status(400).json(response)
        }
    }

    public static async count(req: Request, res: Response) {
        try {
            const filter: any = {};
            if (req.query.org) filter['org'] = req.query.org;

            const count = await Status.countDocuments(filter);
            const response: JsonResponse = {
                success: true,
                message: 'count status',
                data: count
            }
            res.status(200).json(response)
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'failed',
                error: err.message
            }
            res.status(400).json(response)
        }
    }
}
