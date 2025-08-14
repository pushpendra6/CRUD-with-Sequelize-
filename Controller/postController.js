const PostModel = require('../Models/postModel'); 

const createPost = async (req, res) => {
    console.log("in post create methods")
    try {
        const { id } = req.user;
        // Check if userId exists in UserModel
        const userId = id;
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and  content are required' });
        }
        console.log(title, content);
        const post = await PostModel.create({ title, content, userId });
        res.status(201).json({
            message: 'Post created successfully',
            post: {
                title: post.title,
                content: post.content,
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Error creating post', details: err.message });
    }
};

//all posts

const getAllPosts = async (req, res) => {
    console.log("in getpost  methods")
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        // Fetch posts with count
        const { count, rows } = await PostModel.findAndCountAll({
            limit,
            offset
        });

        // If no posts found
        if (rows.length === 0) {
            return res.status(404).json({ error: "No posts found for this page." });
        }

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalPosts: count,
            posts: rows
        });

    } catch (err) {
        res.status(500).json({ error: 'Error fetching posts', details: err.message });
    }
};

//only logined user posts
const userPosts = async (req, res) => {
    try{
        const { id } = req.user;

        const page = parseInt(req.params.page) || 1;
        const limit = 10;
        // Validation
        if (page < 1) {
            return res.status(400).json({ error: "Page number must be 1 or greater." });
        }

        const offset = (page - 1) * limit;

        // Get paginated posts
        const { count, rows } = await PostModel.findAndCountAll({
            where: { userId: id },
            limit: limit,
            offset: offset
        });

        if (rows.length === 0) {
            return res.status(404).json({ error: "No posts found for this page." });
        }

        res.status(200).json({
            page,
            limit,
            totalPosts: count,
            totalPages: Math.ceil(count / limit),
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }

};

//delete logined user posts
const deletePost = async (req, res) => {
    try {
        const { id } = req.user;
        const postId = req.params.id;
        if (!postId) {
            return res.status(400).json({ error: 'Post ID is required' });
        }
        //delete post that belongs to user 
        const deletedCount = await PostModel.destroy({
            where: { id: postId, userId: id }
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                error: 'Post not found or does not belong to the user'
            });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts', details: error.message });
    }
}

//updaet post
const updatePost = async (req,res) => {
    try{
        const { postId, title, content} = req.body;
        const post = await PostModel.findOne({ where: { id: postId} });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
 
        if (title !== undefined && title !== null && title.trim() !== '') {
            post.title = title;
        }
        if (content !== undefined && content !== null && content.trim() !== '') {
            post.content = content;
        }

        await post.save();
        res.status(200).json({
            message: 'Post updated successfully',
            user : {
                title: post.title,
                content: post.content,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error updating post',
            error: error.message
        });
    }
}
module.exports = {
    createPost,
    getAllPosts,
    deletePost,
    userPosts,
    updatePost
}
