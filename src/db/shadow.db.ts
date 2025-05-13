import * as dotenv from 'dotenv';
dotenv.config();

import mongoose, { Connection } from 'mongoose';

const shadow: Connection = mongoose.createConnection(
  `mongodb://localhost:27017/${process.env.NEO_SHADOW_DB}`,
);

shadow.on('connected', () => {
  console.log('Connexion réussie à la base holding');
});

shadow.on('error', (err) => {
  console.error('Erreur connexion base holding :', err);
});

export default shadow;
