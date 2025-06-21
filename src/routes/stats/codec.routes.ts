import { Router } from 'express';
import BlacklistController  from '../../controllers/stats/codec.controllers';
import { GenerateCodeSchema, ValidateCodeSchema, RemoveCodeSchema } from '../../types/codec';
import { rateLimiter, authenticate, device, permissions, validateInput } from '../../middleware'; // Middleware personnalisés

const router = Router();

// Middleware de limitation de débit pour les endpoints sensibles
const strictRateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Maximum 10 requêtes par IP toutes les 15 minutes
  message: {
    success: false,
    message: 'Trop de tentatives. Réessayez plus tard.',
    error: 'Rate limit exceeded'
  }
});

const moderateRateLimit = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Maximum 50 requêtes par IP toutes les 5 minutes
  message: {
    success: false,
    message: 'Trop de requêtes. Ralentissez.',
    error: 'Rate limit exceeded'
  }
});


router.post(
  '/generate', 
  strictRateLimit,
  authenticate,
  device('GENERATION DE OTP'),
  permissions('CREATE-OTP'),
  validateInput(ValidateCodeSchema, ['username']),
  BlacklistController.generateCode
);

router.post(
  '/validate', 
  strictRateLimit,
  authenticate,
  device('VALIDATION OTP'),
  permissions('VERIFY-OTP'),
  validateInput(GenerateCodeSchema, ['code']),
  BlacklistController.validateCode
);

router.get(
  '/one-use-token', 
  moderateRateLimit,
  authenticate,
  device('CREATE ONE USE TOKEN'),
  permissions('CREATE-ONE-TOKEN'),
  BlacklistController.generateOneUseToken
);

router.get(
  '/health',
  authenticate,
  device('READ HEALTH'),
  permissions('READ-HEALTH'),
  BlacklistController.healthCheck
);

router.delete(
  '/admin/remove',
  authenticate,
  device('DELETE OTP'),
  permissions('DELETE-OTP'),
  validateInput(RemoveCodeSchema, ['code']),
  BlacklistController.removeCode
);

router.get(
  '/admin/info/:code',
  authenticate,
  device('GET INFO OTP'),
  permissions('READ-OTP'),
  BlacklistController.getCodeInfo
);

router.get(
  '/admin/stats',
  authenticate,
  device('GET SYSTEM BLACKLIST'),
  permissions('READ-BLACKLIST'),
  BlacklistController.getSystemStats
);

router.get(
  '/admin/active',
  authenticate,
  device('GET ACTIVE BLACKLIST CODE'),
  permissions('READ-BLACKLIST'),
  BlacklistController.listActiveCodes
);

router.post(
  '/admin/cleanup',
  authenticate,
  device('BLACKLIST SYSTEM FORCE CLEAN UP'),
  permissions('DELETE-BLACKLIST'),
  BlacklistController.forceCleanup
);

router.post(
  '/admin/auto-cleanup/start',
  authenticate,
  device('BLACKLIST SYSTEM AUTO CLEAN UP'),
  permissions('DELETE-BLACKLIST'),
  BlacklistController.startAutoCleanup
);

router.post(
  '/admin/auto-cleanup/stop',
  authenticate,
  device('BLACKLIST SYSTEM STOP AUTO CLEAN UP'),
  permissions('STOP-BLACKLIST'),
  BlacklistController.stopAutoCleanup
);

export default router;