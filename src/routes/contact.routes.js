import express from 'express';
import { Router } from 'express';

import * as contactController from '../controllers/contact.controller.js';

const router = Router();

router.get('/:id', contactController.getContacts);

router.post('/:id/create', contactController.create);

router.put('/:id/update', contactController.update);

router.delete('/:id/remove', contactController.remove);

export default router;