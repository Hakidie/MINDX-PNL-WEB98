import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from './models/Customer.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import { customers, products, orders } from './data.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Customer.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();

        // Map "id" field from data.js -> "_id" for MongoDB
        const customerDocs = customers.map(c => ({ _id: c.id, name: c.name, email: c.email, age: c.age }));
        const productDocs = products.map(p => ({ _id: p.id, name: p.name, price: p.price, quantity: p.quantity }));
        const orderDocs = orders.map(o => ({
            _id: o.id,
            customerId: o.customerId,
            productId: o.productId,
            quantity: o.quantity,
            totalPrice: o.totalPrice,
        }));

        await Customer.insertMany(customerDocs);
        await Product.insertMany(productDocs);
        await Order.insertMany(orderDocs);

        console.log(`Seeded: ${customerDocs.length} customers, ${productDocs.length} products, ${orderDocs.length} orders`);
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seed();
