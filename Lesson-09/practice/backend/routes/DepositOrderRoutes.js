import express from 'express';
const router = express.Router();

import { authJWT } from '../middlewares/authJWT.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

import { addDepositOrder, getDepositOrdersWithCustomer, getMyDepositOrders } from '../controllers/DepositOrderController.js';

router.get('/depositOrders/my', authJWT, authorizeRoles('CUSTOMER'), getMyDepositOrders);
router.get('/depositOrders', authJWT, authorizeRoles('MANAGER', 'EMPLOYEE'), getDepositOrdersWithCustomer);
router.post('/depositOrders', authJWT, authorizeRoles('CUSTOMER'), addDepositOrder);

export default router;
