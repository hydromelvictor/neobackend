import { Request, Response } from 'express';
import Employee from '../../models/users/employee.models';
import { JsonResponse } from '../../types/api';
import Org from '../../models/associate/org.models';


export default class EmployeeContorller {
    public static filters = (q: any): any => {
        const filter: any = {};

        if (q.name) filter.fullname = { $regex: q.name, $options: 'i' };
        if (q.online) filter.online = q.online === 'true';
        if (q.auth) filter.isAuthenticated = q.auth === 'true';
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

    public static async signUp(req: Request, res: Response) {
        try {
            const org = await Org.findById(req.body.org);
            if (!org) throw new Error('Organisation non trouvée');
            if (!org.access) throw new Error('Organisation non active');

            const employee = new Employee(req.body);
            const exist = await Employee.findOne({
                $or: [
                    { email: employee.email },
                    { phone: employee.phone }
                ]
            })
            if (exist) throw new Error('email or phone exist');
            await employee.save();

            const response: JsonResponse = {
                success: true,
                message: 'Utilisateur enregistré avec succès',
                data: employee
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
            const employee = await Employee.findById(req.params.id);
            if (!employee) throw new Error('Utilisateur non trouvé');

            const response: JsonResponse = {
                success: true,
                message: 'Utilisateur trouvé avec succès',
                data: employee
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
            const employees = await Employee.paginate(EmployeeContorller.filters(req.query), options);

            const response: JsonResponse = {
                success: true,
                message: 'Utilisateurs trouvés avec succès',
                data: employees
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

    public static async update(req: Request, res: Response) {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) throw new Error('Utilisateur non trouvé');

            const email = req.body.email;
            const phone = req.body.phone;
            const exist = await Employee.findOne({
                $or: [
                    email ? { email } : {},
                    phone ? { phone } : {}
                ]
            })
            if (exist?._id.toString() !== employee._id.toString()) throw new Error('email or phone exist');
            
            Object.assign(employee, req.body);
            await employee.save();

            const response: JsonResponse = {
                success: true,
                message: 'Utilisateur mis à jour avec succès',
                data: employee
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
            const employee = await Employee.findById(req.params.id);
            if (!employee) throw new Error('Utilisateur non trouvé');

            await employee.deleteOne();
            const response: JsonResponse = {
                success: true,
                message: 'Utilisateur supprimé avec succès',
                data: employee
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
            const count = await Employee.countDocuments(EmployeeContorller.filters(req.query));
            const response: JsonResponse = {
                success: true,
                message: 'Nombre d\'utilisateurs trouvés avec succès',
                data: count
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
}
