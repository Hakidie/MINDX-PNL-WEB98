import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    _id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
}, { _id: false }); // disable auto ObjectId generation, we supply our own

const CustomersModel = mongoose.model('customers', customerSchema);

export default CustomersModel;
