import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
    name: String,
    birthdate: Date,
});

const AuthorModel = mongoose.model('authors', authorSchema);
export default AuthorModel;
