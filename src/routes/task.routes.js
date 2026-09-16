import express from 'express';
import { Router } from 'express';

import * as taskController from '../controllers/task.controller.js';

const router = Router();

router.get('/', taskController.getAllTask);
router.get('/:id', taskController.getTaskPerUser);


router.post('/create', taskController.create);

export default router;