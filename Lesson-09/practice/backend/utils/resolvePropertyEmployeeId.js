import EmployeesModel from '../models/Employee.js';
import ManagersModel from '../models/Manager.js';

// Resolves which employeeId a property should be assigned to based on the caller's role.
// Pass propertyInfo when updating an existing property, so an EMPLOYEE caller can be
// restricted to only modifying their own properties.
export const resolvePropertyEmployeeId = async (req, propertyInfo = null) => {
    const { employeeId } = req.body;

    if (req.account.role === "EMPLOYEE") {
        // Get employee info
        const employeeInfo = await EmployeesModel.findOne({ accountId: req.account.id });
        if (!employeeInfo) {
            const error = new Error("Employee not found");
            error.status = 404;
            throw error;
        }
        // Check if current employee changing property they are managing
        if (propertyInfo && propertyInfo.employeeId.toString() !== employeeInfo._id.toString()) {
            const error = new Error("You can only update your own properties");
            error.status = 403;
            throw error;
        }
        return employeeInfo._id;
    }

    if (req.account.role === "MANAGER") {
        // Get manager info
        const managerInfo = await ManagersModel.findOne({ accountId: req.account.id });
        if (!managerInfo) {
            const error = new Error("Manager not found");
            error.status = 404;
            throw error;
        }
        // Check input employeeId for property controller
        if (!employeeId) {
            const error = new Error("employeeId is required");
            error.status = 400;
            throw error;
        }
        // Check employeeId is correct
        const targetEmployee = await EmployeesModel.findOne({ _id: employeeId });
        if (!targetEmployee) {
            const error = new Error("Employee not found");
            error.status = 404;
            throw error;
        }
        return employeeId;
    }
};

export default resolvePropertyEmployeeId;
