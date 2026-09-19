import express from 'express';
import { Router } from 'express';

import { authenticate } from '../middlewares/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();

router.get('/', userController.getUsers);

router.get('/dashboard', authenticate, userController.getDashboard);

export default router;