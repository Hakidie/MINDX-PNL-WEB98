import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    _id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String },
    salt: { type: String },
    apiKey: { type: String },
}, { _id: false }); 

const CustomersModel = mongoose.model('customers', customerSchema);

export default CustomersModel;
