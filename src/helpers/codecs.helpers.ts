// Blacklist : Un objet pour stocker les codes à 6 chiffres avec le username associé
import ShortUniqueId from 'short-uuid';

export const blacklist: { [key: string]: string } = {};


// Fonction pour générer un code et ajouter  à la blacklist avec un username
export const addToBlacklist = (username: string) => {
  let code = '';
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  } while (blacklist[code]);
  
  blacklist[code] = username;
  console.log(`Code ${code} ajouté pour l'utilisateur ${username}`);
  
  return code;
};

// Fonction pour supprimer un code de la blacklist
export const removeFromBlacklist = (code: string) => {
  if (!code) throw new Error('code invalid');

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
