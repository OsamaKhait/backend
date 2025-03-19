import express, { Router, Request, Response } from 'express';
import {getAllVisites, createVisite, getOneVisite, modifyVisite, deleteVisite} from '../controllers/visiteController';
import { authMiddleware } from '../middlewares/auth';

const router: Router = express.Router();

router.get('/', authMiddleware, getAllVisites);
router.post('/',authMiddleware, createVisite);
router.get('/:id', authMiddleware, getOneVisite);
router.put('/:id', authMiddleware, modifyVisite);
router.delete('/:id', authMiddleware, deleteVisite);

export default router;