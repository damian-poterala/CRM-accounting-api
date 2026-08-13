import express from 'express';
import { Router } from 'express';

// import { authenticate } from '../middlewares/auth.middleware';
import * as userController from '../controllers/user.controller.js';

const router = Router();

router.get('/', userController.getUsers);

export default router;