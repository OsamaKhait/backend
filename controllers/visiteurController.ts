import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Visiteur from '../models/visiteur';
import jwt from 'jsonwebtoken';

// Get one visiteur
export const getOneVisiteur = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const visiteur = await Visiteur.findById(req.params.id)
    .populate('visites')
    .populate('portefeuillePraticiens');

  if (!visiteur) {
    res.status(404).json({ message: 'Visiteur non trouvé' });
    return;
  }
  res.status(200).json(visiteur);
});

// Modify visiteur
export const modifyVisiteur = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const updates: any = { ...req.body };

  // If password is provided, hash it
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedVisiteur = await Visiteur.findByIdAndUpdate(req.params.id, updates, { new: true });

  if (!updatedVisiteur) {
    res.status(404).json({ message: 'Visiteur non trouvé' });
    return;
  }

  res.status(200).json({ message: 'Visiteur mis à jour avec succès !', updatedVisiteur });
});

// Delete visiteur
export const deleteVisiteur = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  await Visiteur.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Visiteur supprimé avec succès !' });
});

// Get all visiteurs
export const getAllVisiteurs = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const visiteurs = await Visiteur.find();
  res.status(200).json(visiteurs);
});

// Create visiteur
// Create visiteur
export const createVisiteur = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Validate input
  await body('email').isEmail().withMessage('Email invalide').run(req);
  await body('email').notEmpty().withMessage('Email est requis').run(req);
  await body('password').notEmpty().withMessage('Mot de passe requis').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    // Check if the email already exists
    const existingVisiteur = await Visiteur.findOne({ email: req.body.email });
    if (existingVisiteur) {
      res.status(400).json({ message: 'Cet email est déjà utilisé' });
      return;
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new visiteur
    const newVisiteur = new Visiteur({
      ...req.body,
      password: hashedPassword, // Save the hashed password
    });

    await newVisiteur.save();
    res.status(201).json({ message: 'Visiteur enregistré avec succès !', visiteur_id: newVisiteur._id });
  } catch (error: any) {
    console.error('Error while creating Visiteur:', error);

    if (error.code === 11000) {
      res.status(400).json({ message: 'Email déjà utilisé' });
    } else {
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  }
});

// Add praticien to portefeuille
export const addPraticien = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { visiteur_id, praticien_id } = req.params;

  try {
    const visiteur = await Visiteur.findById(visiteur_id);
    if (!visiteur) {
      res.status(404).json({ message: 'Visiteur non trouvé' });
      return;
    }

    const praticienObjectId = new mongoose.Types.ObjectId(praticien_id);

    if (visiteur.portefeuillePraticiens.includes(praticienObjectId)) {
      res.status(400).json({ message: 'Praticien déjà ajouté' });
      return;
    }

    visiteur.portefeuillePraticiens.push(praticienObjectId);
    await visiteur.save();

    res.status(201).json({ message: 'Praticien ajouté avec succès !' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export const signupValidator = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
];

export const signup = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  } 

  const {email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Request body:', req.body);

  try {
    const visiteur = new Visiteur({
      email,
      password: hashedPassword,
    });

    await visiteur.save();
    res.status(201).json({ message: 'Visiteur enregistré avec succès !', visiteur_id: visiteur._id });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

  export const login = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body;

  try {
    const visiteur = await Visiteur
      .findOne({ email })
      if (!visiteur) {
        res.status(404).json({ message: 'Visiteur non trouvé' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, visiteur.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Mot de passe incorrect' });
        return;
      }

      const token = jwt.sign({ userId: visiteur._id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });

      res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
