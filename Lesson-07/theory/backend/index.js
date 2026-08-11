import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';

// .env setup
dotenv.config();

// Connect to mongodb using connection string
mongoose.connect(process.env.MONGO_URI);

// Backend
const app = express();
app.use(express.json()); // For input body

const saltRounds = 10;

// In-memory store for testing on Postman only (no DB persistence)
const users = [];

app.post('/register', (req, res) => {
    try {
        const { username, email, password } = req.body;
        // tạo chuỗi ngẫu nhiên
        const salt = bcrypt.genSaltSync(saltRounds);
        // thực hiện mã hoá với chuỗi salt
        const hash = bcrypt.hashSync(password, salt);

        users.push({ username, email, password: hash, salt });

        res.status(201).send({
            message: 'Register with hash password!',
            email,
            hash,
            salt
        });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        // tìm thông tin user | tài khoản với email được gửi lên
        const currentUser = users.find((user) => user.email === email);
        if (!currentUser) throw new Error("Sai tài khoản hoặc mật khẩu");

        const hashingPasswordLogin = bcrypt.hashSync(password, currentUser.salt);
        // compare password
        if (hashingPasswordLogin !== currentUser.password) throw new Error("Sai tài khoản hoặc mật khẩu");

        res.status(200).send({
            message: 'Login successfully!',
            email,
            username: currentUser.username,
            hash: hashingPasswordLogin
        });
    } catch (error) {
        res.status(401).send({ message: error.message });
    }
});


app.use('/', customerRoutes);
app.use('/', orderRoutes);
app.use('/', productRoutes);

app.listen(process.env.PORT, () => {
    console.log('Server is running!');
});
