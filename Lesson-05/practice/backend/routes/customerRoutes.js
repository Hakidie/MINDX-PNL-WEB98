import express from 'express';
const router = express.Router();
import { getAllCustomers, getCustomerById, addCustomer, deleteCustomer
        
} from '../controllers/customerController.js';

router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers/', addCustomer);
router.delete('/customers/:id', deleteCustomer);

export default router;
