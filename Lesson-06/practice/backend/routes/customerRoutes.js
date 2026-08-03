import express from 'express';
const router = express.Router();
import { getAllCustomers, getCustomerById, addCustomer, deleteCustomer, getApiKey

} from '../controllers/customerController.js';
import { authApiKey } from '../middlewares/authApiKey.js';

router.get('/customers/getApikey/:id', getApiKey);

// All routes below require a valid apiKey
router.use(authApiKey);

router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers/', addCustomer);
router.delete('/customers/:id', deleteCustomer);

export default router;
