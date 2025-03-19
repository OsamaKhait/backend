import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import Visite from '../models/visite';

// Create a new visite
export const createVisite = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { date_visite, commentaire, visiteur, praticien, motif } = req.body;

    const visite = new Visite({
        date_visite,
        commentaire,
        visiteur,
        praticien,
        motif
    });

    await visite.save();
    res.status(201).json({ message: 'Visite saved successfully!', visite_id: visite._id });
});

// Get one visite by ID
export const getOneVisite = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const visite = await Visite.findById(req.params.id); // Using findById for cleaner syntax
    if (!visite) {
        res.status(404).json({ message: 'Visite not found' });
        return;
    }
    res.status(200).json(visite);
});

// Modify an existing visite
export const modifyVisite = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { date_visite, commentaire, visiteur, praticien, motif } = req.body;

    const visite = await Visite.findById(req.params.id);
    if (!visite) {
        res.status(404).json({ message: 'Visite not found' });
        return;
    }

    // Update fields if provided
    visite.date_visite = date_visite || visite.date_visite;
    visite.commentaire = commentaire || visite.commentaire;
    visite.visiteur = visiteur || visite.visiteur;
    visite.praticien = praticien || visite.praticien;
    visite.motif = motif || visite.motif;

    await visite.save();
    res.status(200).json({ message: 'Visite updated successfully!', visite_id: visite._id });
});

// Delete a visite
export const deleteVisite = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const visite = await Visite.findById(req.params.id);
    if (!visite) {
        res.status(404).json({ message: 'Visite not found' });
        return;
    }

    await Visite.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Visite deleted successfully' });
});

// Get all visites
export const getAllVisites = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const visites = await Visite.find();
    res.status(200).json(visites);
});
