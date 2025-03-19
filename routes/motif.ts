import express, { Router, Request, Response } from 'express';
import {getAllMotifs, createMotif, getOneMotif, modifyMotif, deleteMotif} from '../controllers/motifController';
import { authMiddleware } from '../middlewares/auth';

const router: Router = express.Router();

router.get('/', authMiddleware, getAllMotifs);
router.post('/', authMiddleware, createMotif);
router.get('/:id', authMiddleware, getOneMotif);
router.put('/:id', authMiddleware, modifyMotif);
router.delete('/:id', authMiddleware, deleteMotif);


export default router;