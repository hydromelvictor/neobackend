import { Request, Response } from 'express';
import Attach from '../../models/network/attachment.models';
import { JsonResponse } from '../../types/api';

import fs from "fs/promises";



async function uploading(req: Request, res: Response) {
    try {
        const attachs = req.body.attachs.map((attach: any) => {
            return {
                message: req.params.id,
                path: attach.path,
                type: attach.type,
                size: attach.size
            }
        })
        await Attach.insertMany(attachs);
        res.status(200).send();
    } catch (error: any) {
        const response: JsonResponse = {
            success: false,
            message: error.message
        }
        res.status(400).json(response);
    }
}

async function downlaoding(req: Request, res: Response) {
    try {
        const attach = await Attach.findById(req.params.id);
        if (!attach) throw new Error('attach not found');

        res.download(attach.path);
        res.status(200).send();
    } catch (error: any) {
        const response: JsonResponse = {
            success: false,
            message: error.message
        }
        res.status(400).json(response);
    }
}

async function deleting(req: Request, res: Response) {
    try {
        const attach = await Attach.findById(req.params.id);
        if (!attach) throw new Error('attach not found');

        await fs.unlink(attach.path);
        await attach.deleteOne();
        res.status(200).send();
    } catch (error: any) {
        const response: JsonResponse = {
            success: false,
            message: error.message
        }
        res.status(400).json(response);
    }
}

export { uploading, downlaoding, deleting };
