import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/userController.js';

router.post('/users/register', register);
router.post('/users/login', login);

export default router;
