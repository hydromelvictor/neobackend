import * as dotenv from 'dotenv';
dotenv.config();

import mongoose, { Connection } from 'mongoose';

const shadow: Connection = mongoose.createConnection(
  'mongodb+srv://victorvaddely:izTaIpmrF5jkC3nz@neo.ldk4lda.mongodb.net/?retryWrites=true&w=majority&appName=neo'
);

shadow.on('connected', () => {
  console.log('Connexion réussie à la base holding');
});

shadow.on('error', (err) => {
  console.error('Erreur connexion base holding :', err);
});

export default shadow;
