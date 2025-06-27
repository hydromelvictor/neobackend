import * as dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';

// routes
import manager from './routes/users/manager.routes';
import health from './routes/stats/codec.routes';
import org from './routes/associate/org.routes'
import auth from './routes/users/sign.routes';
import employee from './routes/users/employee.routes';
import account from './routes/marketing/account.routes';
import xaccount from './routes/marketing/xaccount.routes';
import referer from './routes/users/referer.routes';
import product from './routes/marketing/product.routes';
import order from './routes/marketing/order.routes';


// import adminRts from './routes/holding/admin.routes';
import admin from './routes/holding/admin.routes'
import lead from './routes/holding/lead.routes';
import mentor from './routes/holding/mentor.routes';
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
app.use('/uploads', express.static('uploads'));

app.use('/manager', manager);
app.use('/health', health);
app.use('/org', org);
app.use('/auth', auth);
app.use('/employee', employee);
app.use('/account', account);
app.use('/xaccount', xaccount);
app.use('/referer', referer);
app.use('/product', product);
app.use('/order', order);


app.use('/admin', admin);
app.use('/lead', lead);
app.use('/mentor', mentor);
app.use('/ai-response', ai);

export default app;
