import express from 'express';
const router = express.Router();
import {
    getAllOrders,
    getOrdersByCustomerId,
    getHighValueOrders,
    addOrder,
    updateOrderQuantity,
    deleteOrderById
} from '../controllers/orderController.js';
import { authApiKey } from '../middlewares/authApiKey.js';
import { validateRequiredFields } from '../middlewares/validateRequiredFields.js';

router.get('/orders', authApiKey, getAllOrders);
router.get('/customers/:id/orders', authApiKey, getOrdersByCustomerId);
router.get('/orders/largerThan10M', authApiKey, getHighValueOrders);
router.post('/orders', authApiKey, validateRequiredFields(['productId', 'quantity']), addOrder);
router.put('/orders/:id', authApiKey, updateOrderQuantity);
router.delete('/orders/:id', authApiKey, deleteOrderById);

export default router;
