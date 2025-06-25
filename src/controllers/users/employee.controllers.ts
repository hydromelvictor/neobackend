import { Request, Response } from 'express';
import Employee from '../../models/users/employee.models';
import { JsonResponse } from '../../types/api';


export default class EmployeeContorller {
    static filters = (q: any): any => {
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

    static async signUp(req: Request, res: Response) {
        try {
            const employee = new Employee(req.body);
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

    static async retrieve(req: Request, res: Response) {
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

    static async list(req: Request, res: Response) {
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

    static async update(req: Request, res: Response) {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) throw new Error('Utilisateur non trouvé');

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

    static async delete(req: Request, res: Response) {
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

    static async count(req: Request, res: Response) {
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
