import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    content: { type: String, required: true },
    // createAt: { type: String, required: true },
    // updateAt: { type: String, required: true },
}, { timestamps: true });

const PostsModel = mongoose.model('posts', postSchema);

export default PostsModel;
