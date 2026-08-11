import UsersModel from '../models/users.js';

// Check api key
export const authApiKey = async (req, res, next) => {
    try {
        const { apiKey } = req.query;
        if (!apiKey) {
            return res.status(401).json({ message: "Missing apiKey", success: false });
        }

        const match = apiKey.match(/^mern-\$(.+?)\$-\$(.+?)\$-\$(.+)\$$/);
        if (!match) {
            return res.status(401).json({ message: "Invalid apiKey format", success: false });
        }

        const [, userId, email] = match;

        const userInfo = await UsersModel.findById(userId);
        if (!userInfo || userInfo.email !== email || userInfo.apiKey !== apiKey) {
            return res.status(401).json({ message: "Invalid apiKey", success: false });
        }

        req.user = userInfo;
        next();

    } catch (error) {
        res.status(403).send({
            message: error.message,
            success: false
        });
    }
};
