import express from 'express';
import { Router } from 'express';

import { authenticate } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.js';

import * as clientFilesController from '../controllers/client-file.controller.js';

const router = Router();

router.get('/:id/files', clientFilesController.getFiles);
router.get('/:id/files/:fileId/download', clientFilesController.download);

router.post('/:id/files', authenticate, upload.single('file'), clientFilesController.create);

router.delete('/:id/files/:fileId', clientFilesController.remove);

export default router;