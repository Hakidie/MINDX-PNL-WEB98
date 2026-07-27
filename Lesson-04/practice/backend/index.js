import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import CustomersModel from './models/customers.js';
import OrdersModel from './models/orders.js';
import ProductsModel from './models/products.js';

// .env setup
dotenv.config();

// Connect to mongodb using connection string
mongoose.connect(process.env.MONGO_URI);

// Backend
const app = express();
app.use(express.json()); // For input body

// 1. Get all customers/orders/products info
app.get('/customers', async (req, res) => {
    try {
        const allCustomers = await CustomersModel.find();
        res.status(200).json(allCustomers);
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});

app.get('/orders', async (req, res) => {
    try {
        const allOrders = await OrdersModel.find();
        res.status(200).json(allOrders);
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});

app.get('/products', async (req, res) => {
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
});

// 2. Get a customer info by id
app.get('/customers/:id', async (req, res) => {
    try {
        const customerId = req.params.id;
        const customerInfo = await CustomersModel.findById(customerId);

        if (!customerInfo) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(customerInfo);

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});

// 3. Get a customer orders by id
app.get('/customers/:id/orders', async (req, res) => {
    try {
        const customerId = req.params.id;
        const customerOrders = await OrdersModel.find({ customerId: customerId });

        if (customerOrders.length === 0) {
            return res.status(404).json({ message: "Customer orders not found" });
        }

        res.status(200).json(customerOrders);

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});

// 4. Get a orders with totalPrice is larger than 10 mil
app.get('/orders/largerThan10m', async (req, res) => {
    try {
        // const customerId = req.params.id;
        const highValueOrders = await OrdersModel.find({ totalPrice: { $gt: 10000000 } });

        if (highValueOrders.length === 0) {
            return res.status(404).json({ message: "High value orders not found" });
        }

        res.status(200).json(highValueOrders);

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});

// 5. Get products by price range
app.get('/products', async (req, res) => {
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
});

// 6. Add a new customer
app.post('/customers', async (req, res) => {
    try {
        // Get body input
        const { name, email, age } = req.body;
        if (!name || !email || !age) {
            return res.status(400).json({ message: "Name, email and age are required" });
        }

        // Check email unique
        const existedEmail = await CustomersModel.findOne({ email: email })
        if (existedEmail) {
            return res.status(404).json({ message: "Email existed" });
        }

        // Generate new Id
        const lastCustomer = await CustomersModel.findOne().sort({ _id: -1 });
        const lastId = parseInt(lastCustomer._id.replace('c', ''));
        const newId = `c${String(lastId + 1).padStart(3, '0')}`;

        const newCustomer = await CustomersModel.create({
            _id: newId,
            name: name,
            email: email,
            age: age
        });

        res.status(200).json({
            message: "Add new customer successfull",
            data: newCustomer,
            success: true
        });

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});

// 7. Add a new order
app.post('/orders', async (req, res) => {
    try {
        // Get body input
        const { customerId, productId, quantity } = req.body;
        if (!customerId || !productId || !quantity) {
            return res.status(400).json({ message: "customerId, productId and quantity are required" });
        }

        // Check customer
        const customerInfo = await CustomersModel.findById(customerId);
        if (!customerInfo) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Check product, quantity
        const productInfo = await ProductsModel.findById(productId);
        if (!productInfo) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (quantity < 0 || quantity > productInfo.quantity) {
            return res.status(404).json({ message: "Invalid quantity" });
        }

        // Generate new Id
        const lastOrder = await OrdersModel.findOne().sort({ _id: -1 });
        const lastId = parseInt(lastOrder._id.replace('o', ''));
        const newId = `o${String(lastId + 1).padStart(3, '0')}`;

        // Calculate totalPrice and update quantity for that product
        const totalPrice = productInfo.price * quantity;
        productInfo.quantity = productInfo.quantity - quantity;
        await productInfo.save();

        const newOrder = await OrdersModel.create({
            _id: newId,
            customerId: customerId,
            productId: productId,
            quantity: quantity,
            totalPrice: totalPrice
        });

        res.status(200).json({
            message: "Add new order successfull",
            data: newOrder,
            success: true
        });

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});

// 8. Update quantity of an order
app.put('/orders/:id', async (req, res) => {
    try {
        // Get body input
        const { quantity } = req.body;
        if (!quantity) {
            return res.status(400).json({ message: "Quantity are required" });
        }

        // Check order info
        const orderId = req.params.id;
        const orderInfo = await OrdersModel.findById(orderId);
        if (!orderInfo) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Get product, check quantity
        const productInfo = await ProductsModel.findById(orderInfo.productId);
        if (quantity <= 0 || quantity > productInfo.quantity) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        // Calculate totalPrice and update quantity for that product
        const totalPrice = productInfo.price * quantity;

        // Update quantity of products
        const difference = Math.abs(orderInfo.quantity - quantity);
        if (quantity > orderInfo.quantity) {
            productInfo.quantity = productInfo.quantity - difference;
            await productInfo.save();
        }
        if (quantity < orderInfo.quantity) {
            productInfo.quantity = productInfo.quantity + difference;
            await productInfo.save();
        }

        const updateOrder = await OrdersModel.findByIdAndUpdate(orderId, {
            quantity,
            totalPrice
        }, { new: true });

        res.status(200).json({
            message: "Update order successfull",
            data: updateOrder,
            success: true
        });

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});

// 9. Delete a customer by id
app.delete('/customers/:id', async (req, res) => {
    try {
        // Check customer info
        const customerId = req.params.id;
        const customerInfo = await CustomersModel.findById(customerId);
        if (!customerInfo) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const deleteCustomer = await CustomersModel.findByIdAndDelete(customerId);

        res.status(200).json({
            message: "Update order successfull",
            data: deleteCustomer,
            success: true
        });

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});

app.listen(8080, () => {
    console.log('Server is running!');
});
