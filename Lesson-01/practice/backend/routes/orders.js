import { orders } from '../data.js';

function getAllOrdersByCustomerId(request, response, customerId) {
    const customerOrders = orders.filter(o => o.customerId === customerId);
    response.end(JSON.stringify(customerOrders));
}

function getOrdersWithHighValue(request, response) {
    const highValueOrders = orders.filter(o => o.totalPrice > 10000000);
    response.end(JSON.stringify(highValueOrders));
}

export { getAllOrdersByCustomerId, getOrdersWithHighValue }
