import express from 'express';
import { Router } from 'express';

import * as reportController from '../controllers/report.controller.js';

const router = express.Router();

router.get('/excel/all-active-clients', reportController.allClientsExcel);
router.get('/excel/all-tasks', reportController.allTasksExcel);

export default router;