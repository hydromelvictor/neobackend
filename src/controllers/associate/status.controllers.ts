import { Request, Response } from 'express';
import { JsonResponse } from '../../types/api';
import Status from '../../models/associate/status.models';


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
}
