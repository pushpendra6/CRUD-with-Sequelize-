const User = require('../Models/userModel');
const Post = require('../Models/postModel');
const bcrypt =  require('bcrypt');

const getUser = async (req,res) => {
    try {
        console.log('in getuser');
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}

const getUserWithDeleted = async (req, res) => {
    try {
        console.log('in getUserWithDeleted');
        const users = await User.findAll({
            paranoid: false // This includes soft-deleted rows
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

const login = async (req,res) => {
    console.log('in login')
    const { email, password} = req.body
    try{
        const user  = await User.findOne({where:{ email: email} });
        if (!user) {
			return res
				.status(404)
				.json({ message: "User not found with this email" });
	}
    
    // Compare passwords
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return res.status(401).json({ message: "Invalid password" });
	}
	res.status(200).json({  message: `Login successful. Welcome ${user.firstName} ${user.lastName}!` });

    }catch(err){
        console.log(err);
    }   
}


const postUser = async (req,res) => {
    console.log("in post");
    const { firstName, lastName, email , password, age, phone} = req.body;
    console.log(firstName,lastName,email,password,age,phone);
    try {
        if( !firstName || !lastName  || !email || !password || !age  || !phone){
            return res
				.status(400)
				.json({ message: "All fields are required" });
        }
        const newUser = await User.create({firstName, lastName, email, password, age, phone });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}


const deleteUser = async (req,res) => {
    console.log("in delete");
    console.log('Raw req.params.id:', req.params.id); 
    console.log('Type of raw req.params.id:', typeof req.params.id)
    const userId = parseInt(req.params.id,10);
    console.log("USer id:-",userId);
    if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid User ID provided.' });
    }

    try {
        const deletedRowCount = await User.destroy({
            where: { id: userId }
        });
        console.log('Received userId for deletion:', userId);
        console.log('Type of received userId:', typeof userId);
        console.log('Deleted row count:', deletedRowCount);
        if (deletedRowCount > 0) {
            res.status(204).send(); // No content for successful deletion
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
}

const updateUser = async (req,res) => {
    
    const { name } = req.body;
    res.status(200).json( `${name} User Updated`);
}



//Association methods
const getAlluserWithPost = async (req, res) => {
    console.log('in assocaition get all user with post ');
    try {
        const users = await User.findAll({
            include: Post
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getUser,
    getUserById,
    postUser,
    deleteUser,
    updateUser,
    login,
    getAlluserWithPost,
    getUserWithDeleted
}


