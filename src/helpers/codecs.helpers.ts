import ShortUniqueId from 'short-uuid';
import crypto from 'crypto';
import List from '../models/stats/blacklist.models';


// Configuration
const CONFIG = {
  CODE_LENGTH: 6,
  EXPIRATION_MINUTES: 15, // Les codes expirent après 15 minutes
  MAX_ATTEMPTS: 3,        // Maximum 3 tentatives par code
  CLEANUP_INTERVAL: 5 * 60 * 1000, // Nettoyage toutes les 5 minutes
};

// Fonction pour générer un code sécurisé
const generateSecureCode = (): string => {
  // Utilise crypto pour plus de sécurité
  const buffer = crypto.randomBytes(3);
  const code = buffer.readUIntBE(0, 3) % 1000000;
  return code.toString().padStart(CONFIG.CODE_LENGTH, '0');
};

// Fonction pour générer un code et l'ajouter à la blacklist
export const addToBlacklist = async (token: string): Promise<string> => {
  if (!token || token.trim().length === 0) {
    throw new Error('Nom d\'utilisateur requis');
  }

  let code = '';
  let attempts = 0;

  const blacklist = await List.findByName('blacklist');
  if (!blacklist) throw new Error('Blacklist not found');

  // Génère un code unique
  do {
    code = generateSecureCode();
    attempts++;
  } while (blacklist.data.some((entry: any) => entry.code === code));

  // Calcule l'expiration
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CONFIG.EXPIRATION_MINUTES * 60 * 1000);

  blacklist.data.push({
    code,
    token,
    createdAt: now,
    expiresAt,
    attempts: 0,
    maxAttempts: CONFIG.MAX_ATTEMPTS,
  });
  await blacklist.save();
  
  console.log(`Code ${code} généré pour l'utilisateur ${token}, expire à ${expiresAt.toLocaleString()}`);
  
  return code;
};

// Fonction pour vérifier et utiliser un code
export const validateAndUseCode = async (
  code: string
): Promise<{ success: boolean; token?: string; error?: string }> => {
  if (!code || code.length !== CONFIG.CODE_LENGTH) {
    return { success: false, error: "Code invalide" };
  }

  // Récupérer la blacklist
  const blacklist = await List.findByName("blacklist");
  if (!blacklist) throw new Error("Blacklist not found");

  // Trouver l’entrée correspondante
  const entry = blacklist.data.find((e: any) => e.code === code);

  if (!entry) return { success: false, error: "Code introuvable ou expiré" };

  // Vérifier expiration
  const now = new Date();
  if (entry.expiresAt && now > entry.expiresAt) {
    await List.updateOne(
      { name: "blacklist" },
      { $pull: { data: { code } } }
    );

    return { success: false, error: "Code expiré" };
  }

  // Incrémenter le compteur de tentatives
  await List.updateOne(
    { name: "blacklist" },
    { $set: { "data.$[elem].attempts": entry.attempts + 1 } },
    { arrayFilters: [{ "elem.code": code }] }
  );

  if (entry.attempts > entry.maxAttempts) {
    // Trop de tentatives → suppression
    await List.updateOne(
      { name: "blacklist" },
      { $pull: { data: { code } } }
    );

    return { success: false, error: "Trop de tentatives" };
  }

  // Code valide → suppression après usage unique
  const token = entry.token;
  await List.updateOne(
    { name: "blacklist" },
    { $pull: { data: { code } } }
  );

  console.log(`✅ Code ${code} utilisé avec succès pour le token ${token}`);

  return { success: true, token };
};


// Fonction pour supprimer un code spécifique
export const removeFromBlacklist = async (
  code: string
): Promise<{ success: boolean; token?: string; error?: string }> => {
  if (!code) {
    return { success: false, error: "Code invalide" };
  }

  const blacklist = await List.findByName("blacklist");
  if (!blacklist) throw new Error("Blacklist not found");

  if (!blacklist.data.some((entry: any) => entry.code === code)) {
    return { success: false, error: "Code introuvable" };
  }

  const token = blacklist.data.find((entry: any) => entry.code === code).token;

  return { success: true, token }
};


// Fonction pour nettoyer la blacklist
export const cleanupBlacklist = async (): Promise<void> => {
  const blacklist = await List.findByName("blacklist");
  if (!blacklist) throw new Error("Blacklist not found");

  await List.updateOne(
    { name: "blacklist" },
    { $pull: { data: { expiresAt: { $lt: new Date() } } } }
  );
};


// Fonction pour obtenir des informations sur un code
export const getCodeInfo = async (code: string): Promise<any> => {
  const blacklist = await List.findByName("blacklist");
  if (!blacklist) throw new Error("Blacklist not found");

  return blacklist.data.find((entry: any) => entry.code === code);
};


// Générateur de token unique (inchangé)
export const OneUseToken = (): string => ShortUniqueId.generate();


// Export de la configuration pour permettre la personnalisation
export { CONFIG };
