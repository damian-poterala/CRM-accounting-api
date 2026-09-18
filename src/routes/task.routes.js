import express from 'express';
import { Router } from 'express';

import { authenticate } from '../middlewares/auth.middleware.js';

import * as taskController from '../controllers/task.controller.js';

const router = Router();

router.get('/', taskController.getAllTask);
router.get('/:id', taskController.getTaskPerUser);
router.get('/client/:clientId', authenticate, taskController.getTaskPerClient);

router.put('/:id/remove', taskController.remove);
router.put('/:id/complete', taskController.complete);

router.post('/create', taskController.create);

export default router;