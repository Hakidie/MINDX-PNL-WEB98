import PostsModel from '../models/posts.js';

// Add a post
export const addPost = async (req, res) => {
    try {
        const { userId, content } = req.body;

        // Check fields
        if (!userId || !content) {
            return res.status(400).json({ message: "userId and content are required!" });
        }

        const newPost = await PostsModel.create({
            userId: userId,
            content: content,
            // createAt,
            // updatedAt
        });

        res.status(200).json({
            message: "Add new post successfull",
            data: newPost,
            success: true
        });

    } catch (error) {
        res.status(403).send({
            message: error.message,
            success: false
        });
    }
};

// Update a post
export const updatePost = async (req, res) => {
    try {
        // Get body input
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: "content required!", success: false });
        }

        // Check post id
        const { id: postId } = req.params;

        const postInfo = await PostsModel.findById(postId);
        if (!postInfo) {
            return res.status(404).json({ message: "No post found!", success: false });
        }

        const updatedPost = await PostsModel.findByIdAndUpdate(postId, {
            content: content
        }, { new: true });

        res.status(200).json({
            message: "Update post successful",
            data: updatedPost,
            success: true
        });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
};
