import { Router } from 'express';

import authRoutes from './auth.routes.js';
import clientRoutes from './client.routes.js';
import userRoutes from './user.routes.js';
import dictionaryRoutes from './dictionary.routes.js';
import declarationRoutes from './declaration.routes.js';
import commentRoutes from './comment.routes.js';
import contactRoutes from './contact.routes.js';
import locationRoutes from './location.routes.js';
import clientFileRoutes from './client-file.routes.js';
import statisticRoutes from './statistic.routes.js';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/clients', clientRoutes);
router.use('/api/users', userRoutes);
router.use('/api/dictionaries', dictionaryRoutes);
router.use('/api/declarations', declarationRoutes);
router.use('/api/comment', commentRoutes);
router.use('/api/contact', contactRoutes);
router.use('/api/location', locationRoutes);
router.use('/api/file', clientFileRoutes);
router.use('/api/statistic', statisticRoutes);

export default router;