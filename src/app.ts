import * as dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';

// import adminRts from './routes/holding/admin.routes';
import admin from './routes/holding/admin.routes'
import other from './routes/other.routes';
import lead from './routes/holding/lead.routes';
import member from './routes/holding/member.routes';
import mentor from './routes/holding/mentor.routes';
import org from './routes/holding/org.routes';
import ai from './routes/ia/airesp';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';



// Charger le fichier YAML
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));


// database
mongoose.connect(`${process.env.MONGO_HOSTNAME}`)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.error('Connexion à MongoDB échouée !'));

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet({
  crossOriginResourcePolicy: false
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Ajouter Swagger comme middleware
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/admin', admin);
app.use('/auth', other);
app.use('/lead', lead);
app.use('/member', member);
app.use('/mentor', mentor);
app.use('/org', org);
app.use('/ai-response', ai);

export default app;
