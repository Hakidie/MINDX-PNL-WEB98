import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/AuthRoutes.js';
import accountRoutes from './routes/AccountRoutes.js';
import managerRoutes from './routes/ManagerRoutes.js';
import employeeRoutes from './routes/EmployeeRoutes.js';
import propertyRoutes from './routes/PropertyRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
// import productRoutes from './routes/productRoutes.js';

// .env setup
dotenv.config();

// Connect to mongodb using connection string
mongoose.connect(process.env.MONGO_URI);

// Backend
const app = express();
app.use(express.json()); // For input body



app.use('/', authRoutes);
app.use('/', accountRoutes);
app.use('/', managerRoutes);
app.use('/', employeeRoutes);
app.use('/', propertyRoutes);
// app.use('/', orderRoutes);
// app.use('/', productRoutes);

app.listen(process.env.PORT, () => {
    console.log('Server is running!');
});
