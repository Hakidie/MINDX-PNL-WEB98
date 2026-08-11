import CustomersModel from '../models/customers.js';

// Validates the apiKey attached as a query param on every request below.
// Expected format: web-$<customerId>$-$<email>$-$<randomString>$
export const authApiKey = async (req, res, next) => {
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
