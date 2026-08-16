import bcrypt from 'bcrypt';
import AccountsModel from '../models/Account.js';
import EmployeesModel from '../models/Employee.js';
import ManagersModel from '../models/Manager.js';

// Register emplyee
export const registerEmployee = async (req, res) => {
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

        // Get employee's manager info
        const managerInfo = await ManagersModel.findOne({ accountId: req.account.id });
        if (!managerInfo) {
            return res.status(404).json({ message: "Manager not found", success: false });
        }

        // Create account for employee
        const newAccount = await AccountsModel.create({
            email: email,
            password: hash,
            isActive: true,
            role: "EMPLOYEE"
        });

        // Create profile for employee
        switch (newAccount.role) {
            case "EMPLOYEE":
                await EmployeesModel.create({
                    name: newAccount.email,
                    email: newAccount.email,
                    phone: phone,
                    managerId: managerInfo._id,
                    department: department,
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
