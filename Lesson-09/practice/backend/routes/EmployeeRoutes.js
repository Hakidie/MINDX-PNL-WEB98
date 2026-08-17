import express from 'express';
const router = express.Router();

import { authJWT } from '../middlewares/authJWT.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

import { registerEmployee, GetAllEmployeesOfAManager } from '../controllers/EmployeeController.js';

router.post('/employees/register', authJWT, authorizeRoles('MANAGER'), registerEmployee);
router.get('/employees', authJWT, authorizeRoles('MANAGER'), GetAllEmployeesOfAManager);

export default router;
