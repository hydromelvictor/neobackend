import { Request, Response } from 'express';
import { z } from 'zod';
import { JsonResponse } from '../../types/api';
import {
  addToBlacklist,
  validateAndUseCode,
  removeFromBlacklist,
  cleanupBlacklist,
  getStats,
  getCodeInfo,
  OneUseToken
} from '../../helpers/codecs.helpers';

const CodeInfoSchema = z.object({
  code: z.string()
    .length(6, 'Le code doit contenir exactement 6 caractères')
    .regex(/^\d{6}$/, 'Le code doit contenir uniquement des chiffres')
});


export class BlacklistController {
  
  /**
   * Génère un code à 6 chiffres pour un utilisateur
   * POST /api/blacklist/generate
   */
  static async generateCode(req: Request, res: Response): Promise<void> {
    try {
      const username = req.body.username;
      // Génération du code
      const code = await addToBlacklist(username);

      const response: JsonResponse<{ code: string; username: string }> = {
        success: true,
        message: 'Code généré avec succès',
        data: {
          code,
          username
        }
      };

      res.status(201).json(response);
      
    } catch (error: any) {
      console.error('Erreur lors de la génération du code:', error);
      
      const response: JsonResponse = {
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      };
      
      res.status(500).json(response);
    }
  }

  /**
   * Valide et utilise un code
   * POST /api/blacklist/validate
   */
  static async validateCode(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.body;

      // Validation du code
      const result = await validateAndUseCode(code);

      if (result.success) {
        const response: JsonResponse<{ username: string }> = {
          success: true,
          message: 'Code validé avec succès',
          data: {
            username: result.username!
          }
        };
        
        res.status(200).json(response);
      } else {
        const statusCode = result.error === 'Code expiré' ? 410 : 
                          result.error === 'Trop de tentatives' ? 429 : 404;
        
        const response: JsonResponse = {
          success: false,
          message: 'Validation échouée',
          error: result.error
        };
        
        res.status(statusCode).json(response);
      }
      
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

  /**
   * Supprime un code spécifique
   * DELETE /api/blacklist/remove
   */
  static async removeCode(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.body;

      // Suppression du code
      const result = await removeFromBlacklist(code);

      if (result.success) {
        const response: JsonResponse<{ username: string }> = {
          success: true,
          message: 'Code supprimé avec succès',
          data: {
            username: result.username!
          }
        };
        
        res.status(200).json(response);
      } else {
        const response: JsonResponse = {
          success: false,
          message: 'Suppression échouée',
          error: result.error
        };
        
        res.status(404).json(response);
      }
      
    } catch (error: any) {
      console.error('Erreur lors de la suppression du code:', error);
      
      const response: JsonResponse = {
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      };
      
      res.status(500).json(response);
    }
  }

  /**
   * Obtient les informations d'un code spécifique
   * GET /api/blacklist/info/:code
   */
  static async getCodeInfo(req: Request, res: Response): Promise<void> {
    try {
      const code = req.params.code;
      
      // Validation du paramètre
      const validationResult = CodeInfoSchema.safeParse({ code });
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        
        const response: JsonResponse = {
          success: false,
          message: 'Code invalide',
          error: errors
        };
        
        res.status(400).json(response);
        return;
      }

      // Récupération des informations
      const info = getCodeInfo(code);

      if (info) {
        const response: JsonResponse<typeof info> = {
          success: true,
          message: 'Informations du code récupérées',
          data: info
        };
        
        res.status(200).json(response);
      } else {
        const response: JsonResponse = {
          success: false,
          message: 'Code introuvable',
          error: 'Le code spécifié n\'existe pas ou a expiré'
        };
        
        res.status(404).json(response);
      }
      
    } catch (error: any) {
      console.error('Erreur lors de la récupération des informations:', error);
      
      const response: JsonResponse = {
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      };
      
      res.status(500).json(response);
    }
  }

  /**
   * Obtient les statistiques du système
   * GET /api/blacklist/stats
   */
  static async getSystemStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = getStats();

      const response: JsonResponse<typeof stats> = {
        success: true,
        message: 'Statistiques récupérées avec succès',
        data: stats
      };

      res.status(200).json(response);
      
    } catch (error: any) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      
      const response: JsonResponse = {
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      };
      
      res.status(500).json(response);
    }
  }


  static async cleanBlacklist(): Promise<void> {
    try {
      await cleanupBlacklist();
      console.log('Blacklist vidée avec succès');
    } catch (error) {
      console.error('Erreur lors de la vidange de la blacklist:', error);
    }
  }


  /**
   * Génère un token unique à usage unique
   * GET /api/blacklist/one-use-token
   */
  static async generateOneUseToken(req: Request, res: Response): Promise<void> {
    try {
      const token = OneUseToken();

      const response: JsonResponse<{ token: string }> = {
        success: true,
        message: 'Token généré avec succès',
        data: { token }
      };

      res.status(200).json(response);
      
    } catch (error: any) {
      console.error('Erreur lors de la génération du token:', error);
      
      const response: JsonResponse = {
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      };
      
      res.status(500).json(response);
    }
  }

  /**
   * Endpoint de santé pour vérifier l'état du service
   * GET /api/blacklist/health
   */
  static async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const stats = getStats();
      const isHealthy = stats.currentActive >= 0; // Simple vérification

      const response: JsonResponse<{ 
        status: string; 
        timestamp: string; 
        activeCodes: number;
        uptime: number;
      }> = {
        success: isHealthy,
        message: isHealthy ? 'Service en bonne santé' : 'Service dégradé',
        data: {
          status: isHealthy ? 'healthy' : 'unhealthy',
          timestamp: new Date().toISOString(),
          activeCodes: stats.currentActive,
          uptime: stats.uptime
        }
      };

      res.status(isHealthy ? 200 : 503).json(response);
      
    } catch (error: any) {
      console.error('Erreur lors du health check:', error);
      
      const response: JsonResponse = {
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      };
      
      res.status(500).json(response);
    }
  }
}

export default BlacklistController;