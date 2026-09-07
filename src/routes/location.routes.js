import express from 'express';
import { Router } from 'express';

import * as locationController from '../controllers/location.controller.js';

const router = Router();

router.get('/:id', locationController.getLocations);

router.post('/:id/create', locationController.create);

router.put('/:id/update', locationController.update);

router.delete('/:id/remove', locationController.remove);

export default router;