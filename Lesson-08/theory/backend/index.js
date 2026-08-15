import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

// Secret key, thường được lưu trong biến môi trường (env)
const secretKey = 'mysecretkey';

// Dữ liệu mẫu để mã hoá vào JWT
const userData = {
  id: "123",
  username: 'john_doe',
  role: 'user',
};

// Tạo JWT
const token = jwt.sign(userData, secretKey, { expiresIn: '1h' });

// Xác thực JWT
jwt.verify(token, secretKey, (err, decoded) => {
  if (err) {
    console.error('JWT verification failed:', err.message);
  } else {
    console.log('Decoded JWT:');
    console.log(decoded);
  }
});

app.use('/', customerRoutes);
app.use('/', orderRoutes);
app.use('/', productRoutes);

app.listen(process.env.PORT, () => {
    console.log('Server is running!');
});
