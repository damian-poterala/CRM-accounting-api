import express from 'express';
import { Router } from 'express';

import { authenticate } from '../middlewares/auth.middleware.js';
import { getAll } from '../controllers/dictionary.controller.js';

const router = Router();

router.get('/', getAll);

export default router;