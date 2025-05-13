import * as dotenv from 'dotenv';
dotenv.config();

import mongoose, { Connection } from 'mongoose';

const network: Connection = mongoose.createConnection(`${process.env.MONGO_HOSTNAME}`);

network.on('connected', () => {
  console.log('Connexion réussie à la base holding');
});

network.on('error', (err) => {
  console.error('Erreur connexion base holding :', err);
});

export default network;
