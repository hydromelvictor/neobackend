import { Request, Response } from 'express';
import { JsonResponse } from '../../types/api';
import { addToBlacklist, validateAndUseCode } from '../../helpers/codecs.helpers';
import gmail from '../../helpers/gmail.helpers';
import { sending } from '../../helpers/html.helpers';
import { generateToken, verifyToken } from '../../helpers/token.helpers';


const instanciate = (model: string) => {
    switch (model) {
        case 'manager':
            return require('../../models/users/manager.model').default;
        case 'employee':
            return require('../../models/users/employee.models').default;
        case 'admin':
            return require('../../models/users/admin.models').default;
        case 'lead':
            return require('../../models/users/lead.models').default;
        case 'referer':
            return require('../../models/users/referer.models').default;
        default:
            throw new Error('Invalid model');
    }
}


export const authenticate = async (user: any) => {
    user.online = true;
    user.isAuthenticated = true;
    user.disconnected = '';
    await user.save();
    
    const accessToken = generateToken({ id: user._id.toString(), model: user.model.toLowerCase() }, '1h');
    if (!accessToken.success) throw new Error(`${accessToken.error}`);
    
    const refreshToken = generateToken({ id: user._id.toString() }, '7d');
    if (!refreshToken.success) throw new Error(`${refreshToken.error}`);
    
    const response: JsonResponse = {
        success: true,
        message: 'Utilisateur authentifié avec succès',
        data: {
            user,
            accessToken: accessToken.data,
            refreshToken: refreshToken.data
        }
    }
    return response;
};

export const login = async (req: Request, res: Response) => {
    try {
        let Instance = instanciate(req.params.model);

        const user = await Instance.findByEmail(req.body.email);
        if (!user) throw new Error('Utilisateur non trouvé');

        const checked = await user.comparePassword(req.body.password);
        if (!checked) throw new Error('Mot de passe incorrect');

        const auth = await authenticate(user);
        res.status(200).json(auth);
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

export const logout = async (req: Request, res: Response) => {
    try {
        let Instance = instanciate(req.params.model);

        const user = await Instance.findById(req.user._id);
        if (!user) throw new Error('Utilisateur non trouvé');

        user.online = false;
        user.isAuthenticated = false;
        user.disconnected = `hors ligne depuis le ${new Date().toISOString().split('T')[0]}`;
        await user.save();

        const response: JsonResponse = {
            success: true,
            message: 'Utilisateur déconnecté avec succès'
        }

        res.status(200).json(response)
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

export const forgot = async (req: Request, res: Response) => {
    try {
        let Instance = instanciate(req.params.model);

        const user = await Instance.findByEmail(req.body.email);
        if (!user) throw new Error('Utilisateur non trouvé');

        const otp = await addToBlacklist(user._id.toISOString());
        gmail(
            req.body.email,
            'Réinitialisation de mot de passe',
            sending(`${user.firstname} ${user.lastname}`, otp)
        )

        const response: JsonResponse = {
            success: true,
            message: 'email envoyé avec success'
        }
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

export const verify = async (req: Request, res: Response) => {
    try {
        let Instance = instanciate(req.params.model);

        const valid = await validateAndUseCode(req.body.otp);
        if (!valid.success) throw new Error('Invalid OTP');

        const user = await Instance.findById(valid.token);
        if (!user) throw new Error('Utilisateur non trouvé');

        const response: JsonResponse = {
            success: true,
            message: 'Utilisateur authentifié avec succès',
            data: user._id.toISOString()
        }

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

export const reset = async (req: Request, res: Response) => {
    try {
        let Instance = instanciate(req.params.model);

        const user = await Instance.findById(req.params.id);
        if (!user) throw new Error('Utilisateur non trouvé');
        
        user.password = req.body.password;
        user.online = false;
        user.isAuthenticated = false;
        user.disconnected = `hors ligne depuis le ${new Date().toISOString().split('T')[0]}`;
        await user.save();

        const response: JsonResponse = {
            success: true,
            message: 'password definis avec success'
        }

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

export const authorization = async (req: Request, res: Response) => {
    try {
        let Instance = instanciate(req.params.model);
        const user = await Instance.findById(req.params.id);
        if (!user) throw new Error('Utilisateur non trouvé');

        for (const permission of req.body.permissions) {
            if (!user.authorization.includes(permission)) {
                user.authorization.push(permission);
            } else {
                const index = user.authorization.indexOf(permission);
                user.authorization.splice(index, 1);
            }
        }
        await user.save();

        const response: JsonResponse = {
            success: true,
            message: 'Autorisations mises à jour avec succès'
        };

        res.status(200).json(response);
    } catch (error: any) {
        console.error('Erreur lors de la mise à jour des autorisations:', error);
        const response: JsonResponse = {
            success: false,
            message: 'Erreur interne du serveur',
            error: error.message
        };
      
        res.status(500).json(response);
    }
}

export const refresh_token = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) throw new Error('Refresh token manquant');

        const result = verifyToken(refreshToken);
        if (!result.success) throw new Error('Refresh token invalide');

        const decoded: any = result.data;
        
        const accessToken = generateToken({ id: decoded.id }, '1h');
        if (!accessToken.success) throw new Error(`${accessToken.error}`);
        
        res.status(200).json({
            success: true,
            message: 'Nouveau token généré avec succès',
            data: {
                accessToken: accessToken.data
            }
        });
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
