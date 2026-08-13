import { Router } from 'express';

import authRoutes from './auth.routes.js';
import clientRoutes from './client.routes.js';
import userRoutes from './user.routes.js';
import dictionaryRoutes from './dictionary.routes.js';
import declarationRoutes from './declaration.routes.js';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/clients', clientRoutes);
router.use('/api/users', userRoutes);
router.use('/api/dictionaries', dictionaryRoutes);
router.use('/api/declarations', declarationRoutes);

export default router;