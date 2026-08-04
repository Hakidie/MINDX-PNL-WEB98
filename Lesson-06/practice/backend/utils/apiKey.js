import crypto from 'crypto';

export const generateApiKey = (length=12) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

export function buildApikey(customerId, email, randomString) {
    return `web-$${customerInfo._id}$-$${customerInfo.email}$-$${randomString}$`;
}
