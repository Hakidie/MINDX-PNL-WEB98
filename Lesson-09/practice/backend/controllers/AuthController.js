import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AccountsModel from '../models/Account.js';
import CustomersModel from '../models/Customer.js';

// Register
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" });
        }

        // Check email unique
        const existedEmail = await AccountsModel.findOne({ email })
        if (existedEmail) {
            return res.status(409).json({ message: "Email existed" });
        }

        // Hashing password
        const hash = await bcrypt.hash(password, 10);

        const newAccount = await AccountsModel.create({
            email: email,
            password: hash,
            isActive: true,
        });

        switch (newAccount.role) {
            case "CUSTOMER":
                await CustomersModel.create({
                    name: newAccount.email,
                    email: newAccount.email,
                    phone: "",
                    address: "",
                    accountId: newAccount._id
                });
                break;

            case "MANAGER":
                await ManagersModel.create({
                    name: newAccount.email,
                    email: newAccount.email,
                    phone: "",
                    department: "",
                    accountId: newAccount._id
                });
                break;

            default:
                return res.status(404).json({ message: "Requires role!", success: false });
        }

        res.status(201).send({
            message: 'Registered!',
            data: newAccount,
            success: true
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required", success: false });
        }

        const currentAccount = await AccountsModel.findOne({ email });
        if (!currentAccount) {
            return res.status(401).json({ message: "Wrong email or password!", success: false });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, currentAccount.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong email or password!", success: false });
        }

        // Check account status
        if (!currentAccount.isActive) {
           return res.status(401).json({ message: "Account is not active!", success: false });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: currentAccount._id, email: currentAccount.email, role: currentAccount.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).send({
            message: 'Login successfully!',
            email: currentAccount.email,
            role: currentAccount.role,
            token: token,
            success: true
        });
    } catch (error) {
        res.status(500).send({ message: error.message, success: false });
    }
};
