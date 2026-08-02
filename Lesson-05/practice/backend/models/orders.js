import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    _id: { type: String },
    customerId: { type: String, required: true },
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
}, { _id: false });

const OrdersModel = mongoose.model('orders', orderSchema);

export default OrdersModel;
