import express from 'express';
const router = express.Router();
import { getAllCustomers, getCustomerById, addCustomer, deleteCustomer, getApiKey

} from '../controllers/customerController.js';
import { authMiddleware } from '../middlewares/authApiKey.js';

router.get('/customers/getApikey/:id', getApiKey);

// All routes below require a valid apiKey
router.use(authMiddleware.authentication);
router.use(authMiddleware.auhthorizationAdmin);

// Kiểm tra quyền truy cập API
const app = express();

router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers/', addCustomer);
router.delete('/customers/:id', deleteCustomer);

export default router;
