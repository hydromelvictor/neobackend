import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import * as dotenv from 'dotenv';

// import adminRts from './routes/holding/admin.routes';
import orgs from './routes/holding/org.routes';
import mentor from './routes/holding/mentor.routes';

dotenv.config();

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

// app.use('/admin', adminRts);
app.use('/orgs', orgs);
app.use('/mentor', mentor);

export default app;
