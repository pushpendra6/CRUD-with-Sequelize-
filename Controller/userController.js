const User = require('../Models/userModel');
const Post = require('../Models/postModel');
const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();



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

//login method with hashing and bcrypt & token using jwt
const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req,res) => {
    console.log('in login')
    const { email, password } = req.body;
    console.log(email, password);
    try{
        const user  = await User.findOne({where:{ email: email} , attributes: ['id', 'firstName', 'lastName', 'email', 'age', 'phone', 'password']});
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
    //generate JWT token
    const userPayload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            phone: user.phone
        };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '90m' });

	res.status(200).json({  message: `Login successful. Welcome ${user.firstName} ${user.lastName}!`, token: token });

    }catch(err){
        console.log(err);
    }   
}


const addUser = async (req,res) => {
    console.log("in post");
    const { firstName, lastName, email , password, age, phone,role} = req.body;
    
    try {
        if( !firstName || !lastName  || !email || !password || !age  || !phone || !role){
            return res
				.status(400)
				.json({ message: "All fields are required" });
        }
        const newUser = await User.create({firstName, lastName, email, password, age, phone ,role});
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
    try{
        const { id} = req.user;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { firstName, lastName, age, phone } = req.body;
        
        if (firstName !== undefined) user.firstName = firstName; 
        if (lastName !== undefined) user.lastName = lastName; 
        if (age !== undefined) user.age = age; 
        if (phone !== undefined) user.phone = phone;

        console.log('user.phone:',  user.phone);


const nn = await user.update({
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    phone: user.phone
} , {
    where: { id: user.id }
})

console.log('Pushpendra',nn)

        // await user.save();

        res.status(200).json({
            message: 'User updated successfully',
            user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error updating user',
            error: error.message
        });
    }
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
    addUser,
    deleteUser,
    updateUser,
    login,
    getAlluserWithPost,
    getUserWithDeleted
}


