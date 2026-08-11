// Returns a middleware that checks the given fields are present in req.body
export const validateRequiredFields = (fields) => (req, res, next) => {
    const missingField = fields.find((field) => !req.body[field]);

    if (missingField) {
        return res.status(400).json({ message: `${fields.join(', ')} are required`, success: false });
    }

    next();
};
