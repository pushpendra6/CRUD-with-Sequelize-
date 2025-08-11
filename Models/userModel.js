const { DataTypes} = require('sequelize');
const sequelize = require('../Config/database');
const bcrypt =  require('bcrypt');

const UserModel = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                args: true,
                msg: 'Please provide a valid email address.'
            },
             len: {
                args: [5, 255],
                msg: 'Email must be between 5 and 255 characters long.'
            }               
        }
    },
    age:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    phone:{
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true
    },
    password:{
        type: DataTypes.BLOB,
        allowNull: false,
        set(value) {
            const salt = bcrypt.genSaltSync(10); 
            const hashedPassword = bcrypt.hashSync(value, salt); 
            this.setDataValue('password', hashedPassword);
    }
    }
}, {
    tableName: 'user-Model',
    timestamps: true,
    paranoid: true,           // Enables soft delete (adds deletedAt)
    deletedAt: 'deletedAt', 
    
});

module.exports = UserModel;