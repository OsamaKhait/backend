import mongoose, { Schema, Document } from 'mongoose';
import encrypt from 'mongoose-encryption';
import visite from './visite';
import dotenv from 'dotenv';

dotenv.config();

export interface IVisiteur extends Document {
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  date_embauche: Date;
  password: string;
  visites: mongoose.Types.ObjectId[];
  portefeuillePraticiens: mongoose.Types.ObjectId[];
}

const VisiteurSchema: Schema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  tel: { type: String, required: false },
  date_embauche: { type: Date, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  visites: [{ type: mongoose.Types.ObjectId, ref: 'Visite', required: false }],
  portefeuillePraticiens: [{ type: mongoose.Types.ObjectId, ref: 'Praticien', required: false }],
});

VisiteurSchema.plugin(encrypt, { secret: process.env.ENCRYPTION_KEY, encryptedFields: ['nom', 'prenom', 'tel', 'date_embauche'] });

export default mongoose.model<IVisiteur>('Visiteur', VisiteurSchema);