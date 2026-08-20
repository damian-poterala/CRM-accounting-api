import express from 'express';
import { Router } from 'express';

import { authenticate } from '../middlewares/auth.middleware.js';
import * as clientController from '../controllers/client.controller.js';

const router = Router();

router.get('/'            , clientController.getClients);
router.get('/autocomplete', clientController.autocomplete);

router.post('/search', clientController.search);
router.post('', clientController.create);

router.put('/:id', clientController.update);


export default router;