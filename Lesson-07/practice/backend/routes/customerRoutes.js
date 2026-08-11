import express from 'express';
const router = express.Router();
import { getAllCustomers, getCustomerById, addCustomer, deleteCustomer, getApiKey

} from '../controllers/customerController.js';
import { authApiKey } from '../middlewares/authApiKey.js';

router.get('/customers/getApikey/:id', getApiKey);

router.get('/customers', authApiKey, getAllCustomers);
router.get('/customers/:id', authApiKey, getCustomerById);
router.post('/customers/', authApiKey, addCustomer);
router.delete('/customers/:id', authApiKey, deleteCustomer);

export default router;
