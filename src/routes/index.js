import { Router } from 'express';

import authRoutes from './auth.routes.js';
import clientRoutes from './client.routes.js';
import dictionaryRoutes from './dictionary.routes.js';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/clients', clientRoutes);
router.use('/api/dictionaries', dictionaryRoutes);

export default router;