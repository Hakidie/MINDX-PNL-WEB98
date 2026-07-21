import express from 'express';
import crypto from 'crypto';
import { customers, orders, products } from './data.js';

const app = express();
app.use(express.json());

// 1. Get all customer
app.get('/customers', async (req, res) => {
    try {
        const allCustomers = await customers.find();
        res.json(allCustomers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/orders', async (req, res) => {
    try {
        const allOrders = await orders.find();
        res.json(allOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/products', async (req, res) => {
    try {
        const allProducts = await products.find();
        res.json(allProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get customer by id
app.get('/customers/:id', (req, res) => {
    const id = req.params.id;
    const customer = customers.find(item => item.id === id);
    res.send(customer);
});

// 3. Get orders of a customer by id
app.get('/customers/:id/orders', (req, res) => {
    const id = req.params.id;
    const customerOrders = orders.find(item => item.customerId === id);
    res.send(customerOrders);
});

// 4. Get orders with totalPrice larger than 10 mil
app.get('/orders/highvalue', (req, res) => {
    const highValueOrders = orders.find(item => item.totalPrice > 10000000);
    res.send(highValueOrders);
});

// 5. Get orders by price range
app.get('/products', (req, res) => {
    const { minPrice, maxPrice } = req.query;
    const productsList = products.filter(product => product.price >= Number(minPrice) && product.price <= Number(maxPrice));
    res.send(productsList);
});

// 6. Post new customer info
app.post('/customers', (req, res) => {
    const { name, email, age } = req.body || {};

    if (!name || !email || !age) {
        return res.status(400).json({ message: "Name, email and age are required" });
    }

    const emailExists = customers.some(c => c.email === email);
    if (emailExists) {
        return res.status(409).json({ message: "Email already exists" });
    }

    let newId;
    do {
        newId = crypto.randomUUID();
    } while (customers.some(c => c.id === newId));

    const newCustomer = { id: newId, name, email, age };

    customers.push(newCustommer);
    res.json(customers);
});

// 7. Post new order info
app.post('/orders', (req, res) => {
    const { orderId, customerId, productId, quantity } = req.body || {};
    
    if (!customerId || !productId || !quantity) {
        return res.status(400).json({ message: "CustomerId, productId and quantity are required" });
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.quanity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
    }
    
    const totalPrice = quantity * product.price;

    let newId;
    do {
        newId = crypto.randomUUID();
    } while (orders.some(o => o.id === newId));

    const newOrder = { id: newId, customerId, productId, quantity, totalPrice };

    orders.push(newOrder);
    res.json(orders);
});


app.listen(8080, () => {
    console.log('Server is running!');
});
