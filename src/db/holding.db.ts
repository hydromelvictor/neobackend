import * as dotenv from 'dotenv';
dotenv.config();

import mongoose, { Connection } from 'mongoose';

const holding: Connection = mongoose.createConnection(
  `mongodb://localhost:27017/${process.env.NEO_HOLDING_DB}`
);

holding.on('connected', () => {
  console.log('Connexion réussie à la base holding');
});

holding.on('error', (err) => {
  console.error('Erreur connexion base holding :', err);
});

export default holding;
