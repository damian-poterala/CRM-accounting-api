import express from 'express';
import { Router } from 'express';

import { authenticate } from '../middlewares/auth.middleware.js';
import * as clientController from '../controllers/client.controller.js';

const router = Router();

router.get('/'             , authenticate, clientController.getClients);
router.get('/user', authenticate, clientController.getClientsPerUser);
router.get('/autocomplete' , clientController.autocomplete);
router.get('/:id/form-data', clientController.getFormData);
router.get('/:id/details'  , clientController.getDetails);

router.post('/search', authenticate, clientController.search);
router.post('', clientController.create);
// router.post('/import', authenticate, clientController.importClient);
router.post('/import', clientController.importClient);

router.put('/:id', clientController.update);
router.put('/:id/details', clientController.updateDetails);


export default router;