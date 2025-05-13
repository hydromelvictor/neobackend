import * as dotenv from 'dotenv';
dotenv.config();

import mongoose, { Connection } from 'mongoose';

const market: Connection = mongoose.createConnection(process.env.MONGO_HOSTNAME);

market.on('connected', () => {
  console.log('Connexion réussie à la base market');
});

market.on('error', (err) => {
  console.error('Erreur connexion base market :', err);
});

export default market;
