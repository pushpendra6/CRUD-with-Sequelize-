const User1 = require('../Models/userModel1');

const getUser1 = async (req,res) => {
    try {
        console.log('in getuser');
        const users = await User1.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}

const getUserWithDeleted1 = async (req, res) => {
    try {
        console.log('in getUserWithDeleted');
        const users = await User1.findAll({
            paranoid: false // This includes soft-deleted rows
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

const postUser1 = async (req,res) => {
    console.log("in post");
    const { firstName,lastName,email} = req.body;
    console.log(firstName,lastName,email);
    try {
        if( !firstName || !lastName  || !email){
            return res
				.status(400)
				.json({ message: "All fields are required" });
        }
        const newUser = await User1.create({firstName, lastName, email});
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

const deleteUser1 = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user
        const user = await User1.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Soft delete
        await user.destroy(); 

        res.status(200).json({ message: 'User deleted successfully (soft delete)' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};


module.exports ={
    getUser1,
    getUserWithDeleted1,
    postUser1,
    deleteUser1
}
