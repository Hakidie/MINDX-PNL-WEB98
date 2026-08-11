import bcrypt from 'bcrypt';
import UsersModel from '../models/users.js';
import { generateApiKey } from '../utils/generateApiKey.js';

// Register
export const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Check fields
        if (!userName || !email || !password) {
            return res.status(400).json({ message: "userName, email and password are required" });
        }

        // Check email unique:w
        const existedEmail = await UsersModel.findOne({ email: email })
        if (existedEmail) {
            return res.status(409).json({ message: "Email existed" });
        }

        // Create random string
        const salt = bcrypt.genSaltSync(10);
        // Hashing
        const hash = bcrypt.hashSync(password, salt);

        const newCustomer = await UsersModel.create({
            userName: userName,
            email: email,
            password: hash,
            salt: salt,
        });

        res.status(201).send({
            message: 'Registered!',
            data: newCustomer,
            success: true
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required", success: false });
        }

        const currentUser = await UsersModel.findOne({ email: email });
        if (!currentUser) {
            return res.status(401).json({ message: "Wrong email or password!", success: false });
        }

        // compare password
        const hashingPassword = bcrypt.hashSync(password, currentUser.salt);
        if (hashingPassword !== currentUser.password) {
            return res.status(401).json({ message: "Wrong email or password!", success: false });
        }

        // Gennerate api key for user
        const apiKey = await generateApiKey(currentUser);

        res.status(200).send({
            message: 'Login successfully!',
            userName: currentUser.userName,
            email: currentUser.email,
            apiKey: apiKey,
            success: true
        });
    } catch (error) {
        res.status(500).send({ message: error.message, success: false });
    }
};
