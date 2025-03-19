import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Praticien from '../models/praticien';

export const createPraticien = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    await body('email').isEmail().withMessage('Le format de l\'email est invalide').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const praticien = new Praticien({
        nom: req.body.nom as string,
        prenom: req.body.prenom as string,
        tel: req.body.tel as string,
        email: req.body.email as string,
        rue: req.body.rue as string,
        code_postal: req.body.code_postal as string,
        ville: req.body.ville as string,
        visites: req.body.visites as any
    });

    await praticien.save();
    res.status(201).json({ message: 'Praticien enregistré avec succès !', praticien_id: praticien._id });
});

export const getOnePraticien = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const praticien = await Praticien.findOne({ _id: req.params.id });
    if (!praticien) {
        res.status(404).json({ message: 'Praticien non trouvé' });
        return;
    }
    res.status(200).json(praticien);
});

export const modifyPraticien = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const praticien = new Praticien({
        _id: req.params.id as string,
        nom: req.body.nom as string,
        prenom: req.body.prenom as string,
        tel: req.body.tel as string,
        email: req.body.email as string,
        rue: req.body.rue as string,
        code_postal: req.body.code_postal as string,
        ville: req.body.ville as string,
        visites: req.body.visites as any
    });

    await Praticien.updateOne({ _id: req.params.id }, praticien);
    res.status(201).json({ message: 'Praticien mis à jour avec succès !' });
});

export const deletePraticien = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    await Praticien.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Supprimé !' });
});

export const getAllPraticiens = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const praticiens = await Praticien.find();
    res.status(200).json(praticiens);
});