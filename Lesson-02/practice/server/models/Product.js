import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    _id: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
}, { _id: false });

export default mongoose.model('Product', productSchema);
