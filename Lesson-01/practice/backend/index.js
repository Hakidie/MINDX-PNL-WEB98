import http from 'http';
import { getAllCustomers, getCustomerById } from './routes/customers.js';
import { getAllOrdersByCustomerId, getOrdersWithHighValue } from './routes/orders.js';
import { getProducts } from './routes/products.js';

const routes = [
    { method: 'GET', pattern: /^\/$/, handler: (req, res) => res.end('Hello MindX') }, // Landing page
    { method: 'GET', pattern: /^\/customers$/, handler: getAllCustomers }, // 1. Get all customers
    { method: 'GET', pattern: /^\/customers\/([a-zA-Z0-9]+)$/, handler: getCustomerById }, // 2. Get customer info by their ID
    { method: 'GET', pattern: /^\/customers\/([a-zA-Z0-9]+)\/orders$/, handler: getAllOrdersByCustomerId }, // 3. Get order info of a customer by their ID
    { method: 'GET', pattern: /^\/orders\/highvalue$/, handler: getOrdersWithHighValue }, // 4. Get orders with total price larger than 10 mil
    { method: 'GET', pattern: /^\/products$/, handler: getProducts }, // 5. Get all products with price range
];

const app = http.createServer((request, response) => {
    const parsedUrl = new URL(request.url, `http://${request.headers.host}`); // Put url in to URL obj for exercise 5
    const pathname = parsedUrl.pathname; // Get path
    
    // Check route
    const route = routes.find(r =>
        r.method === request.method && r.pattern.test(pathname)
    );

    if (!route) {
        response.statusCode = 404;
        response.end(JSON.stringify({ message: 'Not found' }));
        return;
    }

    // Get params for exercise 2
    const match = pathname.match(route.pattern);
    const params = match.slice(1);

    // Call function to handle excerises
    route.handler(request, response, parsedUrl.searchParams, ...params);
});

app.listen(8080, () => {
    console.log('Server is running!');
});
