import express from 'express';
const router = express.Router();
import {    
    getAllProducts, 
    getProductsByPriceRange, 
} from '../controllers/productController.js';
import { authMiddleware } from '../middlewares/authApiKey.js';

// All product APIs require a valid apiKey
router.use(authMiddleware.authentication);

router.get('/products', getAllProducts);
router.get('/products', getProductsByPriceRange);

export default router;
