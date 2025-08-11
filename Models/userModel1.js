const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database'); 


const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            
        }
    }
}, {
    tableName: 'Model!',
    timestamps: true,
    paranoid:true,
    deletedAt: 'deletedAt', 
});

// Export the User model
module.exports = User;
