import AccountsModel from '../models/Account.js';
import CustomersModel from '../models/Customer.js';
import ManagersModel from '../models/Manager.js';
import EmployeesModel from '../models/Employee.js';

export const getAccountInfo = async (req, res) => {
    try {
        const { email, role } = req.account;

        let accountInfo = {};

        switch (role) {
            case "CUSTOMER":
                accountInfo = await CustomersModel.findOne({ email });
                break;
            case "MANAGER":
                accountInfo = await ManagersModel.findOne({ email });
                break;
            case "EMPLOYEE":
                accountInfo = await EmployeesModel.findOne({ email });
                break;
            default:
                return res.status(404).json({ message: "Requires role!", success: false });
        }

        if (!accountInfo) {
            return res.status(404).json({ message: "No information!", success: false });
        }

        res.status(200).send({
            message: 'Get account info successfully!',
            data: { accountInfo, role },
            success: true
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
}
