import * as dotenv from 'dotenv';
dotenv.config();

import mongoose, { Connection } from 'mongoose';

const shadow: Connection = mongoose.createConnection(`${process.env.MONGO_HOSTNAME}`);

shadow.on('connected', () => {
  console.log('Connexion réussie à la base holding');
});

shadow.on('error', (err) => {
  console.error('Erreur connexion base holding :', err);
});

export default shadow;
