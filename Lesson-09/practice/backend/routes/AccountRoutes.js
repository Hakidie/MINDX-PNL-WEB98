import express from 'express';
const router = express.Router();
import {
    getAccountInfo,
} from '../controllers/AccountController.js';
import { authJWT } from '../middlewares/authJWT.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

router.get('/accounts', authJWT, authorizeRoles('MANAGER', 'CUSTOMER', 'EMPLOYEE'), getAccountInfo);
// router.get('/customers/:id', getCustomerById);
// router.post('/customers/', addCustomer);
// router.delete('/customers/:id', deleteCustomer);

export default router;
