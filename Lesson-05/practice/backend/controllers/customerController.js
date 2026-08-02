import CustomersModel from '../models/customers.js';

// Get all customers
export const getAllCustomers = async (req, res) => {
    try {
        const allCustomers = await CustomersModel.find();
        res.status(200).json(allCustomers);
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};

// Get a customer info by id
export const getCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id;
        const customerInfo = await CustomersModel.findById(customerId);

        if (!customerInfo) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(customerInfo);

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};

// Add a new customer
export const addCustomer = async (req, res) => {
    try {
        // Get body input
        const { name, email, age } = req.body;
        if (!name || !email || !age) {
            return res.status(400).json({ message: "Name, email and age are required" });
        }

        // Check email unique
        const existedEmail = await CustomersModel.findOne({ email: email })
        if (existedEmail) {
            return res.status(404).json({ message: "Email existed" });
        }

        // Generate new Id
        const lastCustomer = await CustomersModel.findOne().sort({ _id: -1 });
        const lastId = parseInt(lastCustomer._id.replace('c', ''));
        const newId = `c${String(lastId + 1).padStart(3, '0')}`;

        const newCustomer = await CustomersModel.create({
            _id: newId,
            name: name,
            email: email,
            age: age
        });

        res.status(200).json({
            message: "Add new customer successfull",
            data: newCustomer,
            success: true
        });

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};

// Delete a customer by id
export const deleteCustomer = async (req, res) => {
    try {
        // Check customer info
        const customerId = req.params.id;
        const customerInfo = await CustomersModel.findById(customerId);
        if (!customerInfo) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const deleteCustomer = await CustomersModel.findByIdAndDelete(customerId);

        res.status(200).json({
            message: "Update order successfull",
            data: deleteCustomer,
            success: true
        });

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};


