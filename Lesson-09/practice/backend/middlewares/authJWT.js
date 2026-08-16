import jwt from 'jsonwebtoken';

export const authJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Missing or invalid Authorization header", success: false });
    }

    // Cut authHeader into an array containing strings then get the token string
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.account = decoded; // { id, email, role }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token", success: false });
    }
};

export default authJWT;
