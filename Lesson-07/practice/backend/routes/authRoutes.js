import express from 'express';
const router = express.Router();
import { registerCustomer, loginCustomer } from '../controllers/authController.js';

router.post('/auth/register', registerCustomer);
router.post('/auth/login', loginCustomer);

export default router;
