import mongoose, { Schema, Document } from 'mongoose';

interface IVisite extends Document {
  date_visite: Date;
  commentaire: string;
  visiteur: mongoose.Types.ObjectId;
  praticien: mongoose.Types.ObjectId;
  motif: mongoose.Types.ObjectId;
}

const visiteSchema: Schema<IVisite> = new Schema({
  date_visite: { type: Date, required: true },
  commentaire: { type: String, required: true },
  visiteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Visiteur', required: true },
  praticien: { type: mongoose.Schema.Types.ObjectId, ref: 'Praticien', required: true },
  motif: { type: mongoose.Schema.Types.ObjectId, ref: 'Motif', required: true },
});

export default mongoose.model<IVisite>('Visite', visiteSchema);