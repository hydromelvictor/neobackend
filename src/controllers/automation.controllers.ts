import { Request, Response } from 'express';
import { JsonResponse } from '../types/api';
import Meet from '../models/automation/meet.models';
import automate from '../automate';
import { title } from 'process';
import builder from '../ai/commercial';


export default class Meeting {
    static filters = (q: any) => {
        const filter: any = {};
        if (q.title) filter[title] = { $regex: q.title, $options: 'i' };
        if (q.after) {
            const now = new Date(q.after as string);
            now.setHours(0, 0, 0, 0);
            filter.moment = { $gte: now };
        }
        if (q.before) {
            const now = new Date(q.before as string);
            now.setHours(0, 0, 0, 0);
            filter.moment = { $lte: now };
        }

        if (q.assign) filter['assign'] = q.assign;
        if (q.lead) filter['lead'] = q.lead;
        if (q.current) filter['current'] = q.current === 'true';
        return filter;
    }

    public static async create(req: Request, res: Response) {
        try {
            const data = { ...req.body };
            const meet = await Meet.create(data)
            automate.addJob(meet._id.toString(), meet.moment.toISOString(), async () => {
                // demander a neo de recontacter le lead
                const relance = builder(
                    meet.assign, 
                    `Tu as une réunion prévue avec le lead ${meet.lead} intitulée "${meet.title}". C'est maintenant.`,
                    data.room,
                    data.lead
                );
                console.log(`C'est l'heure de la réunion: ${meet.title} avec le lead ${meet.lead}`);
                meet.current = false;
                await meet.save();

                const response: JsonResponse = {
                    success: true,
                    message: 'meet triggered',
                    target: data.room,
                    data: relance
                }
                return response;
            })
            const response: JsonResponse = {
                success: true,
                message: 'meet',
                data: meet
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

    public static async retrieve(req: Request, res: Response) {
        try {
            const meet = await Meet.findById(req.params.id);
            if (!meet) throw new Error('not found');

            const response: JsonResponse = {
                success: true,
                message: 'retrieve meet',
                data: meet
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
            const filter = Meeting.filters(req.query);
            const options: any = {
                page: req.query.page || 1,
                limit: req.query.limit || 10,
                sort: { createdAt: -1 }
            }
            const meet = await Meet.paginate(filter, options);

            const response: JsonResponse = {
                success: true,
                message: 'list meet',
                data: meet
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
            const filter = Meeting.filters(req.query);
            const count = await Meet.countDocuments(filter);
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

    public static async stop(req: Request, res: Response) {
        try {
            automate.stopAll();
            const response: JsonResponse = {
                success: true,
                message: 'stoped all jobs',
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

