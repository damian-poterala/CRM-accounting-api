import express from 'express';
import { Router } from 'express';

import * as commentController from '../controllers/comment.controller.js';

const router = Router();

router.post('/:id/create', commentController.create);

export default router;