import express from 'express';
const router = express.Router();
import {
    getAllProducts,
    getProductsByPriceRange,
} from '../controllers/productController.js';
import { authApiKey } from '../middlewares/authApiKey.js';

router.get('/products', authApiKey, getAllProducts);
router.get('/products/priceRange', authApiKey, getProductsByPriceRange);

export default router;
