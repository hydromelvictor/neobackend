import { Request, Response } from 'express';
import Org from '../../models/associate/org.models';
import Manager from '../../models/users/manager.model';
import Settings from '../../models/associate/settings.models';
import Account from '../../models/marketing/account.models';
import { JsonResponse } from '../../types/api';
import Referer from '../../models/users/referer.models';

export default class OrgController {
    public static filters = (q: any) => {
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
                { area: regex },
                { employee: regex }
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

    public static async register(req: Request, res: Response) {
        try {
            const exist = await Org.findOne({ reason: req.body.reason });
            if (exist) throw new Error('L\'organisation existe déjà');

            const manager = await Manager.findById(req.user._id);
            if (!manager) throw new Error('Le manager n\'existe pas');

            const data = { ...req.body };
            data.manager = manager._id;
            data.location = {
                type: 'Point',
                coordinates: [data.lon, data.lat]
            }
            if (data.referer) {
                const referer = await Referer.findOne({ promo: data.referer });
                if (!referer) throw new Error('Le référent n\'existe pas');
                data.referer = referer._id;
            }
            delete data.lat;
            delete data.lon;

            const org = new Org(data);
            await org.save();
            const response: JsonResponse = {
                success: true,
                message: 'L\'organisation a été enregistré avec succès',
                data: org
            };

            await Settings.create({ org: org._id });
            const account = await Account.findOwner(manager._id);
            if (!account || account.main) throw new Error('account not found');

            await Account.create({ owner: org._id, inherit: account._id });

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

    public static async list(req: Request, res: Response) {
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

    public static async update(req: Request, res: Response) {
        try {
            const org = await Org.findById(req.params.id);
            if (!org) throw new Error('L\'organisation n\'existe pas');

            const data = { ...req.body };
            
            if (data.manager) {
                const manager = await Manager.findById(data.manager);
                if (manager && manager._id.toString() !== org.manager.toString()) throw new Error('Le manager n\'existe pas');
            }

            const reason = data.reason;
            const exist = reason ? await Org.findOne({ reason }) : null;
            if (exist && exist._id.toString() !== org._id.toString()) throw new Error(`${reason} already exist`);
            
            if (data.lon || data.lat) {
                data.location.coordinates = [data.lon ? data.lon : org.location.coordinates[0], data.lat ? data.lat : org.location.coordinates[1]]
                delete data.lat;
                delete data.lon;
            }

            Object.assign(org, data);
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

    public static async delete(req: Request, res: Response) {
        try {
            const org = await Org.findById(req.params.id);
            if (!org) throw new Error('L\'organisation n\'existe pas');

            await org.deleteOne();
            const response: JsonResponse = {
                success: true,
                message: 'L\'organisation a été supprimée avec succès'
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

    public static async count(req: Request, res: Response) {
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
