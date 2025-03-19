import express, { Router, Request, Response } from 'express';
import {getAllVisiteurs, createVisiteur, getOneVisiteur, modifyVisiteur, deleteVisiteur, addPraticien, signupValidator, signup, login} from '../controllers/visiteurController';
import { authMiddleware } from '../middlewares/auth';

const router: Router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', login);
router.get('/', authMiddleware, getAllVisiteurs);
router.post('/', authMiddleware, createVisiteur);
router.get('/:id', authMiddleware, getOneVisiteur);
router.put('/:id', authMiddleware, modifyVisiteur);
router.delete('/:id', authMiddleware, deleteVisiteur);
router.post('/:id/praticien', authMiddleware, addPraticien);


export default router;