import express from 'express';
const router = express.Router();
import { authApiKey } from '../middlewares/authApiKey.js';
import { addPost, updatePost } from '../controllers/postController.js';

router.post('/posts', authApiKey, addPost);
router.put('/posts/:id', authApiKey, updatePost);

export default router;
