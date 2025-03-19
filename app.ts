import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';  // Added dotenv for environment variable management

import motifRoutes from './routes/motif';
import praticienRoutes from './routes/praticien';
import visiteRoutes from './routes/visite';
import visiteurRoutes from './routes/visiteur';

// Load environment variables from .env file
dotenv.config();

const app: express.Application = express();

// MongoDB connection using environment variables
const mongoUri = process.env.MONGO_URI || '';  // MONGO_URI stored in .env
mongoose.connect(mongoUri)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log(`Connexion à MongoDB échouée ! ${err}`));

app.use(express.json());

// Use helmet for security-related headers
app.use(helmet());

// CORS setup
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.set('trust proxy', 1);  // Trust the first proxy for reverse proxy setups

// Define route handlers
app.use('/api/motif', motifRoutes);
app.use('/api/praticien', praticienRoutes);
app.use('/api/visite', visiteRoutes);
app.use('/api/visiteur', visiteurRoutes);

export default app;
