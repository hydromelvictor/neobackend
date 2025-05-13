// Blacklist : Un objet pour stocker les codes à 6 chiffres avec le username associé
import ShortUniqueId from 'short-uuid';

export const blacklist: { [key: string]: string } = {};

// Fonction pour générer un code unique à 6 chiffres
export const generateCode = (username: string): string => {
  let code = '';
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  } while (blacklist[code]); // Si le code existe déjà, on génère un nouveau code

  addToBlacklist(code, username)
  return code;
};

// Fonction pour ajouter un code et un username à la blacklist
export const addToBlacklist = (code: string, username: string) => {
    if (blacklist[code]) {
    console.log(`Code ${code} déjà utilisé.`);
  } else {
    blacklist[code] = username;
    console.log(`Code ${code} ajouté pour l'utilisateur ${username}`);
  }
};

// Fonction pour supprimer un code de la blacklist
export const removeFromBlacklist = (code: string) => {
  if (blacklist[code]) {
    const result = blacklist[code];
    delete blacklist[code];
    console.log(`Code ${code} supprimé de la blacklist.`);
    return result;
  } else {
    console.log(`Code ${code} introuvable dans la blacklist.`);
  }
};


export const shortUUID = () => ShortUniqueId.generate();
