import * as dotenv from 'dotenv';
dotenv.config();

import mongoose, { Connection } from 'mongoose';

const market: Connection = mongoose.createConnection(
  'mongodb+srv://victorvaddely:izTaIpmrF5jkC3nz@neo.ldk4lda.mongodb.net/?retryWrites=true&w=majority&appName=neo'
);

market.on('connected', () => {
  console.log('Connexion réussie à la base market');
});

market.on('error', (err) => {
  console.error('Erreur connexion base market :', err);
});

export default market;
