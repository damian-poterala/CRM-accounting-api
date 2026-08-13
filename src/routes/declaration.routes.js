import express from 'express';
import { Router } from 'express';

import * as declarationController from '../controllers/declaration.controller.js';

const router = Router();

router.get('/', declarationController.getDeclarations);

router.post('/save', declarationController.saveDeclarations);

export default router;