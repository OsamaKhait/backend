import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import Motif from '../models/motif';

export const createMotif = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const motif = new Motif({
    libelle: req.body.libelle as string,
  });

  await motif.save();
  res.status(201).json({ 
    message: "Motif saved successfully!",
    motif_id: motif._id 
  });
});

export const getOneMotif = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const motif = await Motif.findOne({ _id: req.params.id });
  if (!motif) {
    res.status(404).json({ message: 'Motif not found' });
    return;
  }
  res.status(200).json(motif);
});

export const modifyMotif = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const motif = {
    _id: req.params.id as string,
    libelle: req.body.libelle as string
  };

  await Motif.updateOne({_id: req.params.id}, motif);
  res.status(201).json({ message: 'Motif updated successfully!', motif_id: motif._id });
});

export const deleteMotif = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  await Motif.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Deleted!' });
});

export const getAllMotifs = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const motifs = await Motif.find();
  res.status(200).json(motifs);
});