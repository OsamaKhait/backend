import express, { Router, Request, Response } from 'express';
import { createPraticien, getOnePraticien, modifyPraticien, getAllPraticiens, deletePraticien} from '../controllers/praticienController';
import { authMiddleware } from '../middlewares/auth';

const router: Router = express.Router();


// Define your routes here

router.get('/', authMiddleware, getAllPraticiens);
router.post('/', authMiddleware, createPraticien);
router.get('/:id', authMiddleware, getOnePraticien);
router.put('/:id', authMiddleware, modifyPraticien);
router.delete('/:id', authMiddleware, deletePraticien);

export default router;