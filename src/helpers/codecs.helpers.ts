import ShortUniqueId from 'short-uuid';
import crypto from 'crypto';

// Interface pour les entrées de blacklist
interface BlacklistEntry {
  username: string;
  createdAt: Date;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
}

// Configuration
const CONFIG = {
  CODE_LENGTH: 6,
  EXPIRATION_MINUTES: 15, // Les codes expirent après 15 minutes
  MAX_ATTEMPTS: 3,        // Maximum 3 tentatives par code
  CLEANUP_INTERVAL: 5 * 60 * 1000, // Nettoyage toutes les 5 minutes
};

// Stockage en mémoire avec informations détaillées
export const blacklist: { [key: string]: BlacklistEntry } = {};

// Statistiques
export const stats = {
  totalGenerated: 0,
  totalExpired: 0,
  totalUsed: 0,
  totalInvalidAttempts: 0,
};

// Fonction pour générer un code sécurisé
const generateSecureCode = (): string => {
  // Utilise crypto pour plus de sécurité
  const buffer = crypto.randomBytes(3);
  const code = buffer.readUIntBE(0, 3) % 1000000;
  return code.toString().padStart(CONFIG.CODE_LENGTH, '0');
};

// Fonction pour générer un code et l'ajouter à la blacklist
export const addToBlacklist = (username: string): string => {
  if (!username || username.trim().length === 0) {
    throw new Error('Nom d\'utilisateur requis');
  }

  let code = '';
  let attempts = 0;

  // Génère un code unique
  do {
    code = generateSecureCode();
    attempts++;
  } while (blacklist[code]);

  // Calcule l'expiration
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CONFIG.EXPIRATION_MINUTES * 60 * 1000);

  // Ajoute à la blacklist
  blacklist[code] = {
    username: username.trim(),
    createdAt: now,
    expiresAt,
    attempts: 0,
    maxAttempts: CONFIG.MAX_ATTEMPTS,
  };

  stats.totalGenerated++;
  
  console.log(`Code ${code} généré pour l'utilisateur ${username}, expire à ${expiresAt.toLocaleString()}`);
  
  return code;
};

// Fonction pour vérifier et utiliser un code
export const validateAndUseCode = (code: string): { success: boolean; username?: string; error?: string } => {
  if (!code || code.length !== CONFIG.CODE_LENGTH) {
    stats.totalInvalidAttempts++;
    return { success: false, error: 'Code invalide' };
  }

  const entry = blacklist[code];
  
  if (!entry) {
    stats.totalInvalidAttempts++;
    return { success: false, error: 'Code introuvable' };
  }

  // Vérifie l'expiration
  if (new Date() > entry.expiresAt) {
    delete blacklist[code];
    stats.totalExpired++;
    return { success: false, error: 'Code expiré' };
  }

  // Vérifie le nombre de tentatives
  entry.attempts++;
  
  if (entry.attempts > entry.maxAttempts) {
    delete blacklist[code];
    stats.totalInvalidAttempts++;
    return { success: false, error: 'Trop de tentatives' };
  }

  // Code valide, on le supprime (utilisation unique)
  const username = entry.username;
  delete blacklist[code];
  stats.totalUsed++;
  
  console.log(`Code ${code} utilisé avec succès pour ${username}`);
  
  return { success: true, username };
};

// Fonction pour supprimer un code spécifique
export const removeFromBlacklist = (code: string): { success: boolean; username?: string; error?: string } => {
  if (!code) {
    return { success: false, error: 'Code invalide' };
  }

  const entry = blacklist[code];
  
  if (entry) {
    const username = entry.username;
    delete blacklist[code];
    console.log(`Code ${code} supprimé manuellement de la blacklist`);
    return { success: true, username };
  } else {
    return { success: false, error: 'Code introuvable dans la blacklist' };
  }
};

// Fonction pour nettoyer les codes expirés
export const cleanupExpiredCodes = (): number => {
  const now = new Date();
  let cleanedCount = 0;

  for (const [code, entry] of Object.entries(blacklist)) {
    if (now > entry.expiresAt) {
      delete blacklist[code];
      cleanedCount++;
      stats.totalExpired++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`${cleanedCount} codes expirés supprimés`);
  }

  return cleanedCount;
};

// Fonction pour obtenir les statistiques
export const getStats = () => ({
  ...stats,
  currentActive: Object.keys(blacklist).length,
  uptime: process.uptime(),
});

// Fonction pour obtenir des informations sur un code
export const getCodeInfo = (code: string): BlacklistEntry | null => {
  return blacklist[code] || null;
};

// Fonction pour lister tous les codes actifs (pour debug)
export const listActiveCodes = (): Array<{ code: string; username: string; expiresAt: Date; attempts: number }> => {
  return Object.entries(blacklist).map(([code, entry]) => ({
    code,
    username: entry.username,
    expiresAt: entry.expiresAt,
    attempts: entry.attempts,
  }));
};

// Générateur de token unique (inchangé)
export const OneUseToken = (): string => ShortUniqueId.generate();

// Fonction pour démarrer le nettoyage automatique
export const startAutoCleanup = (): NodeJS.Timeout => {
  console.log('Démarrage du nettoyage automatique des codes expirés');
  return setInterval(() => {
    cleanupExpiredCodes();
  }, CONFIG.CLEANUP_INTERVAL);
};

// Fonction pour arrêter le nettoyage automatique
export const stopAutoCleanup = (intervalId: NodeJS.Timeout): void => {
  clearInterval(intervalId);
  console.log('Nettoyage automatique arrêté');
};

// Export de la configuration pour permettre la personnalisation
export { CONFIG };