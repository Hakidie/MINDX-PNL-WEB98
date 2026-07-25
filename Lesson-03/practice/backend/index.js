import express from 'express';
import crypto from 'crypto';


const app = express();

app.use(express.json());

const JSON_SERVER_URL = process.env.JSON_SERVER_URL || 'http://localhost:3000';

// 1. Get all customers / orders / products
app.get('/customers', async (req, res) => {
    try {
        const response = await fetch(`${JSON_SERVER_URL}/customers`);
        if (!response.ok) throw new Error(`json-server responded with status ${response.status}`);
        const customers = await response.json();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 
app.get('/orders', async (req, res) => {
    try {
        const response = await fetch(`${JSON_SERVER_URL}/orders`);
        if (!response.ok) throw new Error(`json-server responded with status ${response.status}`);
        const orders = await response.json();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/products', async (req, res) => {
    try {
        const response = await fetch(`${JSON_SERVER_URL}/products`);
        if (!response.ok) throw new Error(`json-server responded with status ${response.status}`);
        const products = await response.json();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get customer by id
app.get('/customers/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await fetch(`${JSON_SERVER_URL}/customers/${id}`);
        if (response.status === 404) {
            return res.status(404).json({ message: "Customer not found" });
        }
        if (!response.ok) throw new Error(`json-server responded with status ${response.status}`);
        const customer = await response.json();
        res.send(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 3. Get orders of a customer by id (fixed: .find -> filter via query, returns ALL matching orders)
app.get('/customers/:id/orders', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await fetch(`${JSON_SERVER_URL}/orders?customerId=${id}`);
        if (!response.ok) throw new Error(`json-server responded with status ${response.status}`);
        const customerOrders = await response.json();
 
        if (customerOrders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this customer' });
        }
 
        res.send(customerOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 
// 4. Get orders with totalPrice larger than 10 mil (fixed: .find -> _gt filter, returns ALL matching)
app.get('/orders/highvalue', async (req, res) => {
    try {
        const response = await fetch(`${JSON_SERVER_URL}/orders?totalPrice_gt=10000000`);
        if (!response.ok) throw new Error(`json-server responded with status ${response.status}`);
        const highValueOrders = await response.json();
        res.send(highValueOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Get products, optionally filtered by price range (merged with route #5, was duplicated)
app.get('/products', async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
 
        // json-server supports range filters natively via _gte / _lte
        let url = `${JSON_SERVER_URL}/products`;
        if (minPrice !== undefined || maxPrice !== undefined) {
            const params = new URLSearchParams();
            if (minPrice !== undefined) params.append('price_gte', minPrice);
            if (maxPrice !== undefined) params.append('price_lte', maxPrice);
            url += `?${params.toString()}`;
        }
 
        const response = await fetch(url);
        if (!response.ok) throw new Error(`json-server responded with status ${response.status}`);
        const products = await response.json();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Post new customer info
app.post('/customers', async (req, res) => {
    const { name, email, age } = req.body || {};
 
    if (!name || !email || !age) {
        return res.status(400).json({ message: "Name, email and age are required" });
    }
 
    try {
        const existingRes = await fetch(`${JSON_SERVER_URL}/customers?email=${encodeURIComponent(email)}`);
        if (!existingRes.ok) throw new Error(`json-server responded with status ${existingRes.status}`);
        const existing = await existingRes.json();
 
        if (existing.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        }
 
        const newCustomer = { id: crypto.randomUUID(), name, email, age };
 
        const createRes = await fetch(`${JSON_SERVER_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCustomer),
        });
        if (!createRes.ok) throw new Error(`json-server responded with status ${createRes.status}`);
 
        const created = await createRes.json();
        res.json(created);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 7. Post new order info
app.post('/orders', async (req, res) => {
    const { customerId, productId, quantity } = req.body || {};
 
    if (!customerId || !productId || !quantity) {
        return res.status(400).json({ message: "CustomerId, productId and quantity are required" });
    }
 
    try {
        const productRes = await fetch(`${JSON_SERVER_URL}/products/${productId}`);
        if (productRes.status === 404) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (!productRes.ok) throw new Error(`json-server responded with status ${productRes.status}`);
        const product = await productRes.json();
 
        if (quantity > product.quantity || quantity < 1) {
            return res.status(400).json({ message: "Invalid quantity" });
        }
 
        const totalPrice = quantity * product.price;
        const newOrder = { id: crypto.randomUUID(), customerId, productId, quantity, totalPrice };
 
        const createRes = await fetch(`${JSON_SERVER_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder),
        });
        if (!createRes.ok) throw new Error(`json-server responded with status ${createRes.status}`);
 
        const created = await createRes.json();
        res.json(created);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 
// 8. PUT quantity of an order by id
app.put('/orders/:id', async (req, res) => {
    const { quantity } = req.body || {};
    const orderId = req.params.id;
 
    try {
        const orderRes = await fetch(`${JSON_SERVER_URL}/orders/${orderId}`);
        if (orderRes.status === 404) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        if (!orderRes.ok) throw new Error(`json-server responded with status ${orderRes.status}`);
        const order = await orderRes.json();
 
        const productRes = await fetch(`${JSON_SERVER_URL}/products/${order.productId}`);
        if (productRes.status === 404) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (!productRes.ok) throw new Error(`json-server responded with status ${productRes.status}`);
        const product = await productRes.json();
 
        if (quantity > product.quantity || quantity < 1) {
            return res.status(400).json({ message: "Invalid quantity" });
        }
 
        const totalPrice = quantity * product.price;
 
        const updateRes = await fetch(`${JSON_SERVER_URL}/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity, totalPrice }),
        });
        if (!updateRes.ok) throw new Error(`json-server responded with status ${updateRes.status}`);
 
        const updatedOrder = await updateRes.json();
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 
// 9. DEL a customer by id
app.delete('/customers/:id', async (req, res) => {
    const id = req.params.id;
 
    try {
        const checkRes = await fetch(`${JSON_SERVER_URL}/customers/${id}`);
        if (checkRes.status === 404) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng" });
        }
        if (!checkRes.ok) throw new Error(`json-server responded with status ${checkRes.status}`);
        const customerToDelete = await checkRes.json();
 
        const deleteRes = await fetch(`${JSON_SERVER_URL}/customers/${id}`, {
            method: 'DELETE',
        });
        if (!deleteRes.ok) throw new Error(`json-server responded with status ${deleteRes.status}`);
 
        res.status(200).json({
            message: "Xóa khách hàng thành công",
            customer: customerToDelete,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(8080, () => {
    console.log('Server is running!');
});
