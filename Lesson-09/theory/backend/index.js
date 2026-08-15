import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import AuthorModel from './models/authors.js';
import BookModel from './models/books.js';

// .env setup
dotenv.config();

// Connect to mongodb using connection string
mongoose.connect(process.env.MONGO_URI);

// Backend
const app = express();
app.use(express.json()); // For input body

// Tạo một tác giả
const author = new AuthorModel({
    name: 'J.K. Rowling',
    birthdate: new Date('1965-07-31'),
});

// Lưu tác giả vào cơ sở dữ liệu
try {
    const savedAuthor = await author.save();

    // Tạo một cuốn sách tham chiếu đến tác giả
    const book = new BookModel({
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: savedAuthor._id, // Tham chiếu đến tác giả
    });

    // Lưu cuốn sách vào cơ sở dữ liệu
    await book.save();
} catch (err) {
    console.error(err);
}

try {
    const book = await BookModel.findOne({ title: 'Harry Potter and the Sorcerer\'s Stone' })
        .populate('author');
    console.log('Tên cuốn sách:', book.title);
    console.log('Tên tác giả:', book.author.name);
} catch (err) {
    console.error(err);
}

app.use('/', customerRoutes);
app.use('/', orderRoutes);
app.use('/', productRoutes);

app.listen(process.env.PORT, () => {
    console.log('Server is running!');
});
