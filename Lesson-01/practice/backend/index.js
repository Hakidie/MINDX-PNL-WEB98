import http from 'http';
import { getAllCustomers, getCustomerById } from './routes/customers.js';
import { getAllOrdersByCustomerId, getOrdersWithHighValue } from './routes/orders.js';
import { getProducts } from './routes/products.js';

const routes = [
    { method: 'GET', pattern: /^\/$/, handler: (req, res) => res.end('Hello MindX') },
    { method: 'GET', pattern: /^\/customers$/, handler: getAllCustomers },
    { method: 'GET', pattern: /^\/customers\/([a-zA-Z0-9]+)$/, handler: getCustomerById },
    { method: 'GET', pattern: /^\/customers\/([a-zA-Z0-9]+)\/orders$/, handler: getAllOrdersByCustomerId },
    { method: 'GET', pattern: /^\/orders\/highvalue$/, handler: getOrdersWithHighValue },
    { method: 'GET', pattern: /^\/products$/, handler: getProducts },
];

const app = http.createServer((request, response) => {
    const parsedUrl = new URL(request.url, `http://${request.headers.host}`);
    const pathname = parsedUrl.pathname;

    const route = routes.find(r =>
        r.method === request.method && r.pattern.test(pathname)
    );

    if (!route) {
        response.statusCode = 404;
        response.end(JSON.stringify({ message: 'Not found' }));
        return;
    }

    const match = pathname.match(route.pattern);
    const params = match.slice(1);

    route.handler(request, response, parsedUrl.searchParams, ...params);
});

app.listen(8080, () => {
    console.log('Server is running!');
});
