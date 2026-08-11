import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

// .env setup
dotenv.config();

// Connect to mongodb using connection string
mongoose.connect(process.env.MONGO_URI);

// Backend
const app = express();
app.use(express.json());

app.use('/', userRoutes);
app.use('/', postRoutes);

app.listen(process.env.PORT, () => {
    console.log('Server is running!');
});
