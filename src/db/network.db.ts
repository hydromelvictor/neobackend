import * as dotenv from 'dotenv';
dotenv.config();

import mongoose, { Connection } from 'mongoose';

const network: Connection = mongoose.createConnection(
  `mongodb://localhost:27017/${process.env.NEO_NETWORK_DB}`,
);

network.on('connected', () => {
  console.log('Connexion réussie à la base holding');
});

network.on('error', (err) => {
  console.error('Erreur connexion base holding :', err);
});

export default network;
