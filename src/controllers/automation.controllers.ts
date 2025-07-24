import { Request, Response } from 'express';
import { JsonResponse } from '../types/api';
import Relance from '../models/automation/relance.models';
import automate from '../automate';

export default class RelanceController {
    public static async create(req: Request, res: Response) {
        try {
            const relance = await Relance.create({ assign: req.params.id, ...req.body });
            automate.addJob(relance._id.toString(), relance.relance.toString(), async () => {
                // dire a l'IA de relancer la conversation avec le client
                const response: JsonResponse = {
                    success: true,
                    message: 'add relance',
                    data: relance
                }
                res.status(200).json(response)
            });
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
            const relance = await Relance.findById(req.params.id);
            if (!relance) throw new Error('not found');

            const response: JsonResponse = {
                success: true,
                message: 'retrieve relance',
                data: relance
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
            if (req.query.assign) filter['assign'] = req.query.assign;

            const options: any = {
                page: req.query.page || 1,
                limit: req.query.limit || 10,
                sort: { createdAt: -1 }
            }
            const relance = await Relance.paginate(filter, options);
            const response: JsonResponse = {
                success: true,
                message: 'list relance',
                data: relance
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
            const relance = await Relance.findById(req.params.id);
            if (!relance) throw new Error('not found');

            await relance.deleteOne();
            const response: JsonResponse = {
                success: true,
                message: 'delete relance'
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

    public static async count(req: Request, res: Response) {
        try {
            const filter: any = {};
            if (req.query.assign) filter['assign'] = req.query.assign;

            const options: any = {
                page: req.query.page || 1,
                limit: req.query.limit || 10,
                sort: { createdAt: -1 }
            }
            const count = await Relance.countDocuments(filter, options);
            const response: JsonResponse = {
                success: true,
                message: 'count relance',
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

    public static async update(req: Request, res: Response) {
        try {
            const relance = await Relance.findById(req.params.id);
            if (!relance) throw new Error('not found');

            Object.assign(relance, req.body);
            await relance.save();

            const response: JsonResponse = {
                success: true,
                message: 'update relance'
            }
            res.status(200).json(response);
        } catch (err: any) {
            const response: JsonResponse = {
                success: false,
                message: 'failed',
                error: err.message
            }
            res.status(400).json(response)
        }
    }

    public static async stop(req: Request, res: Response) {
        try {
            automate.stopAll();
            const response: JsonResponse = {
                success: true,
                message: 'stop relance'
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
