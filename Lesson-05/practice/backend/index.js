import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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

app.use('/', customerRoutes);
app.use('/', orderRoutes);
app.use('/', productRoutes);

app.listen(process.env.PORT, () => {
    console.log('Server is running!');
});
















