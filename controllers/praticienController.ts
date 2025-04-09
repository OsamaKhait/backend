import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Praticien from '../models/praticien';

// Interface pour une erreur MongoDB avec code
interface MongoError extends Error {
    code?: number;
}

// Créer un praticien avec vérification des doublons (email)
export const createPraticien = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    await body('email').isEmail().withMessage('Le format de l\'email est invalide').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        // Vérifier si un praticien avec le même email existe déjà
        const existingPraticien = await Praticien.findOne({ email: req.body.email });
        if (existingPraticien) {
            res.status(409).json({ message: 'Un praticien avec cet email existe déjà' });
            return;
        }

        // Créer un nouveau praticien si l'email n'est pas trouvé
        const praticien = new Praticien({
            nom: req.body.nom as string,
            prenom: req.body.prenom as string,
            tel: req.body.tel as string,
            email: req.body.email as string,
            rue: req.body.rue as string,
            code_postal: req.body.code_postal as string,
            ville: req.body.ville as string,
            visites: req.body.visites as any,
        });

        await praticien.save();
        res.status(201).json({ message: 'Praticien enregistré avec succès !', praticien_id: praticien._id });
    } catch (error: unknown) {
        const mongoError = error as MongoError;
        if (mongoError.code === 11000) {
            res.status(409).json({ message: 'Un praticien avec cet email existe déjà' });
        } else {
            res.status(500).json({
                message: 'Erreur lors de la création du praticien',
                error: mongoError.message,
            });
        }
    }
});

export const modifyPraticien = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const praticien = {
            nom: req.body.nom as string,
            prenom: req.body.prenom as string,
            tel: req.body.tel as string,
            email: req.body.email as string,
            rue: req.body.rue as string,
            code_postal: req.body.code_postal as string,
            ville: req.body.ville as string,
            visites: req.body.visites as any,
        };

        await Praticien.updateOne({ _id: req.params.id }, praticien, {
            runValidators: true, // Permet de lancer les validations lors de la mise à jour
        });
        res.status(201).json({ message: 'Praticien mis à jour avec succès !' });
    } catch (error: unknown) {
        const mongoError = error as MongoError;
        if (mongoError.code === 11000) {
            res.status(409).json({ message: 'Un praticien avec cet email existe déjà' });
        } else {
            res.status(500).json({
                message: 'Erreur lors de la mise à jour du praticien',
                error: mongoError.message,
            });
        }
    }
});

export const getOnePraticien = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const praticien = await Praticien.findOne({ _id: req.params.id });
    if (!praticien) {
        res.status(404).json({ message: 'Praticien non trouvé' });
        return;
    }
    res.status(200).json(praticien);
});

export const deletePraticien = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    await Praticien.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Praticien supprimé avec succès !' });
});



export const getAllPraticiens = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const praticiens = await Praticien.find();
    console.log(praticiens);
    res.status(200).json(praticiens);
});
