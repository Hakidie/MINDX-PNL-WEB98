import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// import CustomersModel from './models/customers.js';
// import OrdersModel from './models/orders.js';
// import ProductsModel from './models/products.js';

// .env setup
dotenv.config();

// Connect to mongodb using connection string
// mongoose.connect(process.env.MONGO_URI);

// Backend
const app = express();
const PORT = process.env.PORT
app.use(express.json()); // For input body


async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
}
startServer();


