import CustomersModel from '../models/Customer.js';
import ManagersModel from '../models/Manager.js';
import EmployeesModel from '../models/Employee.js';

const roleModelMap = {
    CUSTOMER: CustomersModel,
    MANAGER: ManagersModel,
    EMPLOYEE: EmployeesModel,
};

// Resolves the caller's own profile from their account (req.account.id / req.account.role).
// Returns { _id, managerId } — managerId is null for roles that don't have one (Customer, Manager).
export const resolveAccountProfile = async (req) => {
    const Model = roleModelMap[req.account.role];
    if (!Model) {
        const error = new Error("Unsupported role");
        error.status = 400;
        throw error;
    }

    const profile = await Model.findOne({ accountId: req.account.id });
    if (!profile) {
        const error = new Error(`${req.account.role} not found`);
        error.status = 404;
        throw error;
    }

    return {
        _id: profile._id,
        managerId: profile.managerId ?? null,
    };
};

export default resolveAccountProfile;
