import CustomersModel from '../models/customers.js';

const authApiKey = async (req, res, next) => {
    try {
        const { apiKey } = req.query;
        if (!apiKey) {
            return res.status(401).json({ message: "Missing apiKey", success: false });
        }

        const match = apiKey.match(/^web-\$(.+?)\$-\$(.+?)\$-\$(.+)\$$/);
        if (!match) {
            return res.status(401).json({ message: "Invalid apiKey format", success: false });
        }

        const [, customerId, email] = match;

        const customerInfo = await CustomersModel.findById(customerId);
        if (!customerInfo || customerInfo.email !== email || customerInfo.apiKey !== apiKey) {
            return res.status(401).json({ message: "Invalid apiKey", success: false });
        }

        req.customer = customerInfo;
        next();

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};

export const authMiddleware = {
    authentication: (req, res, next) => {
        const isAuthenticated = true; // Kiểm tra xem người dùng đã được xác thực hay chưa
        if (isAuthenticated) {
            // Người dùng đã được xác thực, cho phép truy cập
            next();
        } else {
            res.status(401).send('Unauthorized'); // Trả về lỗi 401 nếu không được xác thực
        }
    },
        auhthorizationAdmin: (req, res, next) => {
            const userRole = 'admin'; // Vai trò của người dùng (ví dụ: admin hoặc user)
            if (userRole === 'admin') {
                next(); // Cho phép truy cập vào route
            } else {
                res.status(403).send('Forbidden'); // Trả về lỗi 403 nếu không có quyền truy cập
            }
        }
}
export default authMiddleware;
