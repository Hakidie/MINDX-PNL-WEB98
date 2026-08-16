import express from 'express';
const router = express.Router();

import { authJWT } from '../middlewares/authJWT.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

import { register, login } from '../controllers/AuthController.js';
import { registerManager } from '../controllers/ManagerController.js';
import { registerEmployee } from '../controllers/EmployeeController.js';

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/managers/register', registerManager);
router.post('/auth/employees/register', authJWT, authorizeRoles('MANAGER'), registerEmployee);

export default router;
