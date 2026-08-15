import express from 'express';
const router = express.Router();
import {    
    getAllOrders, 
    getOrdersByCustomerId, 
    getHighValueOrders, 
    addOrder, 
    updateOrderQuantity
} from '../controllers/orderController.js';
import { authMiddleware } from '../middlewares/authApiKey.js';

// All order APIs require a valid apiKey
router.use(authMiddleware.authentication);

router.get('/orders', getAllOrders);
router.get('/customers/:id/orders', getOrdersByCustomerId);
router.get('/orders/largerThan10M', getHighValueOrders);
router.post('/orders', addOrder);
router.put('/orders/:id', updateOrderQuantity);

export default router;
