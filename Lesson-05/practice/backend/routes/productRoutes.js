import express from 'express';
const router = express.Router();
import {    
    getAllProducts, 
    getProductsByPriceRange, 
} from '../controllers/productController.js';

router.get('/products', getAllProducts);
router.get('/products', getProductsByPriceRange);

export default router;
