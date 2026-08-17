import express from 'express';
const router = express.Router();

import { authJWT } from '../middlewares/authJWT.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

import { addPropertyInfo, updatePropertyInfo, GetAllPropertiesOfAnEmployee } from '../controllers/PropertyController.js';

// All product APIs require a valid apiKey
router.post('/properties', authJWT, authorizeRoles('MANAGER', "EMPLOYEE"), addPropertyInfo);
router.put('/properties', authJWT, authorizeRoles('MANAGER', 'EMPLOYEE'), updatePropertyInfo);
router.get('/properties', authJWT, authorizeRoles('EMPLOYEE'), GetAllPropertiesOfAnEmployee);

export default router;
