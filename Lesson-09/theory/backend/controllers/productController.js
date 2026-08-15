import ProductsModel from '../models/products.js';

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const allProducts = await ProductsModel.find();
        res.status(200).json(allProducts);
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};

// Get products by price range
export const getProductsByPriceRange = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
        const products = await ProductsModel.find({ 
            totalPrice: { $gt: minPrice, $lt: maxPrice } 
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "Products not found" });
        }

        res.status(200).json(products);

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};
