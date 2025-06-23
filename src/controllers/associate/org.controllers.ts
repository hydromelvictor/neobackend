import { Request, Response } from 'express';
import Org from '../../models/associate/org.models';
import Manager from '../../models/users/manager.model';
import { JsonResponse } from '../../types/api';


export default class OrgController {
    static filters = (q: any) => {
        const filter: any = {};

        if (q.name) {
            const regex = { $regex: q.name, $options: 'i' };
            filter.$or = [
                { reason: regex },
                { country: regex },
                { state: regex },
                { address: regex },
                { sector: regex },
                { service: regex },
                { area: regex }
            ]
        }

        if (q.manager) filter.manager = q.manager;
        if (q.referer) filter.referer = q.referer;
        if (q.lat && q.lon && q.radius) {
            filter.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(q.lon), parseFloat(q.lat)]
                    },
                    $maxDistance: parseInt(q.radius)
                }
            }
        }

        return filter;
    }

    static async register(req: Request, res: Response) {
        try {
            const exist = await Org.findOne({ reason: req.body.reason });
            if (exist) throw new Error('L\'organisation existe déjà');

            const manager = await Manager.findById(req.body.manager);
            if (!manager) throw new Error('Le manager n\'existe pas');

            const org = new Org(req.body);
            await org.save();
            const response: JsonResponse = {
                success: true,
                message: 'L\'organisation a été enregistré avec succès',
                data: org
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

    static async retrieve(req: Request, res: Response) {
        try {
            const org = await Org.findById(req.params.id);
            if (!org) throw new Error('L\'organisation n\'existe pas');

            const response: JsonResponse = {
                success: true,
                message: 'L\'organisation a été récupérée avec succès',
                data: org
            };
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la récupération de l\'organisation:', error);
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };
      
            res.status(500).json(response);
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10 } = req.query;
            
            const options = { page: parseInt(page as string), limit: parseInt(limit as string), sort: { createdAt: -1 } };
            const orgs = await Org.paginate(OrgController.filters(req.query), options);
            const response: JsonResponse = {
                success: true,
                message: 'Les organisations ont été récupérées avec succès',
                data: orgs
            };
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la récupération de l\'organisation:', error);
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };
      
            res.status(500).json(response);
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const org = await Org.findById(req.params.id);
            if (!org) throw new Error('L\'organisation n\'existe pas');

            if (req.body.manager) {
                const manager = await Manager.findById(req.body.manager);
                if (manager && manager._id.toString() !== org.manager.toString()) throw new Error('Le manager n\'existe pas');
            }
            
            Object.assign(org, req.body);
            await org.save();

            const response: JsonResponse = {
                success: true,
                message: 'L\'organisation a été mise à jour avec succès',
                data: org
            };
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la récupération de l\'organisation:', error);
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };
      
            res.status(500).json(response);
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const org = await Org.findById(req.params.id);
            if (!org) throw new Error('L\'organisation n\'existe pas');

            await org.deleteOne();
            const response: JsonResponse = {
                success: true,
                message: 'L\'organisation a été supprimée avec succès',
                data: org
            };
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la récupération de l\'organisation:', error);
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };
      
            res.status(500).json(response);
        }
    }

    static async count(req: Request, res: Response) {
        try {
            const count = await Org.countDocuments(OrgController.filters(req.query));
            const response: JsonResponse = {
                success: true,
                message: 'Le nombre d\'organisations a été récupéré avec succès',
                data: count
            };
            res.status(200).json(response);
        } catch (error: any) {
            console.error('Erreur lors de la récupération de l\'organisation:', error);
            const response: JsonResponse = {
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            };
      
            res.status(500).json(response);
        }
    }
}