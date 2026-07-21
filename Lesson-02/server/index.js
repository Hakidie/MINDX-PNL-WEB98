import express from 'express';
import { customers } from './data.js';

const app = express();
app.use(express.json());

app.get('', (req, res) => {
    const queryParrams = req.query;
    res.send(queryParrams);
});

app.get('/customers', (req, res) => {
    const customer = customers;
    res.send(customer);
});

app.get('/customers/:id', (req, res) => {
    const { id } = req.params;
    const customer = customers.find(item => item.id === id);
    res.send(customer);
});

app.post('/customers', (req, res) => {
    const body = req.body;
    customers.push(body);
    res.send(customers);
});


app.listen(8080, () => {
    console.log('Server is running!');
});
