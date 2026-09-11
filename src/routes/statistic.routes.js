import express from 'express';
import { Router } from 'express';

import * as statisticController from '../controllers/statistic.controller.js';

const router = Router();

router.get('/', statisticController.getStatistics);

export default router;