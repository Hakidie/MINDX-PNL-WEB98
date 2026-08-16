import bcrypt from 'bcrypt';
import AccountsModel from '../models/Account.js';
import ManagersModel from '../models/Manager.js';

// Register manager
export const registerManager = async (req, res) => {
    try {
        const { email, password, phone, department } = req.body;

        // Check fields
        if (!email || !password || !phone || !department) {
            return res.status(400).json({ message: "email and password are required" });
        }

        // Check email unique
        const existedEmail = await AccountsModel.findOne({ email })
        if (existedEmail) {
            return res.status(409).json({ message: "Email existed" });
        }

        // Hashing password
        const hash = await bcrypt.hash(password, 10);

        // Create account for manager
        const newAccount = await AccountsModel.create({
            email: email,
            password: hash,
            isActive: true,
            role: "MANAGER"
        });

        // Create profile for manager
        if (newAccount.role === "MANAGER") {
            await ManagersModel.create({
                name: newAccount.email,
                email: newAccount.email,
                phone: phone,
                department: department,
                accountId: newAccount._id
            });
        } else {
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
