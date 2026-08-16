import express from 'express';
const router = express.Router();

import { registerManager } from '../controllers/ManagerController.js';

router.post('/managers/register', registerManager);

export default router;
