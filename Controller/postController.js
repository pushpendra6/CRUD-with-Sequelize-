const PostModel = require('../Models/postModel'); 
const UserModel = require('../Models/userModel'); 

const createPost = async (req, res) => {
    console.log("in post create methods")
    try {
        const { title, content, userId } = req.body;
        const post = await PostModel.create({ title, content, userId });
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: 'Error creating post', details: err.message });
    }
};

const getAllPosts = async (req, res) => {
    console.log("in getpost  methods")
    try {
        const posts = await PostModel.findAll({ include: UserModel });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching posts', details: err.message });
    }
};

module.exports = {
    createPost,
    getAllPosts
}
