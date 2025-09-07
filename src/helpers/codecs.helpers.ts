import ShortUniqueId from 'short-uuid';
import crypto from 'crypto';
import Redis from "ioredis";

// Interface pour les entrées de blacklist
interface BlacklistEntry {
  username: string;
  createdAt: Date;
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
export const blacklist = new Redis({host: "127.0.0.1", port: 6379});
blacklist.on("error", (err) => {
  console.error("Redis error:", err);
});
//export const blacklist: { [key: string]: BlacklistEntry } = {};

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
export const addToBlacklist = async (username: string): Promise<string> => {
  if (!username || username.trim().length === 0) {
    throw new Error('Nom d\'utilisateur requis');
  }

  let code = '';
  let attempts = 0;

  // Génère un code unique
  do {
    code = generateSecureCode();
    attempts++;
  } while (await blacklist.exists(code));

  // Calcule l'expiration
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CONFIG.EXPIRATION_MINUTES * 60 * 1000);

  // Ajoute à la blacklist
  await blacklist.hmset(code, {
    username: username.trim(),
    createdAt: now.toISOString(),
    attempts: '0',
    maxAttempts: CONFIG.MAX_ATTEMPTS.toString(),
  });
  await blacklist.expireat(code, Math.floor(expiresAt.getTime() / 1000));

  stats.totalGenerated++;
  
  console.log(`Code ${code} généré pour l'utilisateur ${username}, expire à ${expiresAt.toLocaleString()}`);
  
  return code;
};

// Fonction pour vérifier et utiliser un code
export const validateAndUseCode = async (
  code: string
): Promise<{ success: boolean; username?: string; error?: string }> => {
  if (!code || code.length !== CONFIG.CODE_LENGTH) {
    stats.totalInvalidAttempts++;
    return { success: false, error: "Code invalide" };
  }

  // Récupérer toutes les infos stockées
  const entry = await blacklist.hgetall(code);

  if (!entry || Object.keys(entry).length === 0) {
    stats.totalInvalidAttempts++;
    return { success: false, error: "Code introuvable ou expiré" };
  }

  // Incrémenter le compteur de tentatives dans Redis
  const attempts = await blacklist.hincrby(code, "attempts", 1);
  const maxAttempts = parseInt(entry.maxAttempts, 10);

  if (attempts > maxAttempts) {
    // Trop de tentatives → suppression
    await blacklist.del(code);
    stats.totalInvalidAttempts++;
    return { success: false, error: "Trop de tentatives" };
  }

  // Code valide → suppression (utilisation unique)
  const username = entry.username;
  await blacklist.del(code);
  stats.totalUsed++;

  console.log(`✅ Code ${code} utilisé avec succès pour ${username}`);

  return { success: true, username };
};


// Fonction pour supprimer un code spécifique
export const removeFromBlacklist = async (
  code: string
): Promise<{ success: boolean; username?: string; error?: string }> => {
  if (!code) {
    return { success: false, error: "Code invalide" };
  }

  const entry = await blacklist.hgetall(code);

  if (entry && Object.keys(entry).length > 0) {
    const username = entry.username;
    await blacklist.del(code);

    console.log(`🗑️ Code ${code} supprimé manuellement de la blacklist`);
    return { success: true, username };
  } else {
    return { success: false, error: "Code introuvable ou déjà expiré" };
  }
};


// Fonction pour nettoyer la blacklist
export const cleanupBlacklist = async (): Promise<void> => {
  const keys = await blacklist.keys("*");
  if (keys.length > 0) {
    await blacklist.del(...keys);
    console.log("🚮 Blacklist vidée");
  }
};

// Fonction pour les statistiq
export const getStats = (): {
  totalGenerated: number;
  totalExpired: number;
  totalUsed: number;
  totalInvalidAttempts: number;
  currentActive: number;
  uptime: number;
} => {
  return {
    totalGenerated: stats.totalGenerated,
    totalExpired: stats.totalExpired,
    totalUsed: stats.totalUsed,
    totalInvalidAttempts: stats.totalInvalidAttempts,
    currentActive: stats.totalGenerated - stats.totalUsed,
    uptime: process.uptime(),
  };

};



// Fonction pour obtenir des informations sur un code
export const getCodeInfo = async (code: string): Promise<BlacklistEntry | null> => {
    const entry = await blacklist.hgetall(code);
    if (!entry || Object.keys(entry).length === 0) {
      return null;
    }
    return {
      username: entry.username,
      createdAt: new Date(entry.createdAt),
      attempts: parseInt(entry.attempts, 10),
      maxAttempts: parseInt(entry.maxAttempts, 10),
    };
};


// Générateur de token unique (inchangé)
export const OneUseToken = (): string => ShortUniqueId.generate();


// Export de la configuration pour permettre la personnalisation
export { CONFIG };