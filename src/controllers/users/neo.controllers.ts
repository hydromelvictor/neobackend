import { Request, Response } from 'express';
import { JsonResponse } from '../../types/api';
import Neo from '../../models/users/neo.models';

export default class NeoController  {
    public static filters(q: any): any {
        const filter: any = {};
        
        if (q.name) filter.fullname = { $regex: q.name, $options: 'i' };
        if (q.sex) filter.sex = q.sex;
        if (q.version) filter.version = q.version;
        if (q.org) filter.org = q.org;
        if (q.online) filter.online = q.online === 'true';

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
            const neo = new Neo(req.body);
            await neo.save();

            const response: JsonResponse = {
                success: true,
                message: 'Utilisateur enregistré avec succès',
                data: neo
            };

            res.status(201).json(response);
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
            const neo = await Neo.findById(req.params.id);
            if (!neo) throw new Error('Utilisateur non trouvé');

            const response: JsonResponse = {
                success: true,
                message: 'Utilisateur trouvé avec succès',
                data: neo
            };

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
            const { page = 1, limit = 10 } = req.query;
            const options = { page: parseInt(page as string), limit: parseInt(limit as string), sort: { createdAt: -1 } };
            const neos = await Neo.paginate(NeoController.filters(req.query), options);
            const response: JsonResponse = {
                success: true,
                message: 'Utilisateurs trouvés avec succès',
                data: neos
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

    public static async update(req: Request, res: Response) {
        try {
            const neo = await Neo.findById(req.params.id);
            if (!neo) throw new Error('Utilisateur non trouvé');

            Object.assign(neo, req.body);
            await neo.save();

            const response: JsonResponse = {
                success: true,
                message: 'Utilisateur mis à jour avec succès',
                data: neo
            };

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
            const neo = await Neo.findById(req.params.id);
            if (!neo) throw new Error('Utilisateur non trouvé');

            await neo.deleteOne();
            const response: JsonResponse = {
                success: true,
                message: 'Utilisateur supprimé avec succès',
                data: neo
            };

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
            const count = await Neo.countDocuments(NeoController.filters(req.query));
            const response: JsonResponse = {
                success: true,
                message: 'Nombre d\'utilisateurs trouvés avec succès',
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
