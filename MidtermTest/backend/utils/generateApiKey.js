import crypto from 'crypto';

// Generate a new apiKey
export const generateApiKey = async (userInfo) => {
    const randomString = crypto.randomBytes(4).toString('hex');
    const apiKey = `mern-$${userInfo._id}$-$${userInfo.email}$-$${randomString}$`;

    userInfo.apiKey = apiKey;
    await userInfo.save();

    return apiKey;
};
