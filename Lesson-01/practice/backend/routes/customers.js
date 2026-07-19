import { customers } from '../data.js';

function getAllCustomers(request, response) {
    response.end(JSON.stringify(customers));
}

function getCustomerById(request, response, id) {
    const customer = customers.find(c => c.id === id);

    if (!customer) {
        response.statusCode = 404;
        response.end(JSON.stringify({ message: 'Customer not found' }));
        return;
    }

    response.end(JSON.stringify(customer));
}

export { getAllCustomers, getCustomerById };
