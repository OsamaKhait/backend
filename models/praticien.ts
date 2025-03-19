import mongoose, { Schema, Document } from 'mongoose';
import { emit } from 'process';
import encrypt from 'mongoose-encryption';
import dotenv from 'dotenv';

dotenv.config();

export interface IPraticien extends Document {
  nom: string;
  prenom: string;
  tel: string;
  specialite: string;
  email: string;
  rue: string;
  ville: string;
  code_postal: string;
  visites: mongoose.Types.ObjectId[];
}

const praticienSchema: Schema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  tel: { type: String, required: true },
  specialite: { type: String, required: false },
  email: { type: String, required: true },
  rue: { type: String, required: true },
  ville: { type: String, required: true },
  code_postal: { type: String, required: true },
  visites: [{ type: mongoose.Types.ObjectId, ref: 'Visite', required: false }],
});

praticienSchema.plugin(encrypt, { secret: process.env.ENCRYPTION_KEY, encryptedFields: ['nom', 'prenom', 'tel', 'rue', 'ville', 'code_postal'] });


export default mongoose.model<IPraticien>('Praticien', praticienSchema);