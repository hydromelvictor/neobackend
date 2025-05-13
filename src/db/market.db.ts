import * as dotenv from 'dotenv';
dotenv.config();

import mongoose, { Connection } from 'mongoose';

const market: Connection = mongoose.createConnection(
  `mongodb://localhost:27017/${process.env.NEO_MARKET_DB}`,
);

market.on('connected', () => {
  console.log('Connexion réussie à la base market');
});

market.on('error', (err) => {
  console.error('Erreur connexion base market :', err);
});

export default market;
