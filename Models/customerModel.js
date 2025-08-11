const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
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
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    timestamps: true,
    paranoid: false,
    deletedAt: 'deletedAt', 
    // Model-level scopes
    defaultScope: {
        attributes: { exclude: ['deletedAt'] }
    },
    scopes: {
        verified: {
            where: { isVerified: true }
        },
        withEmailLike(emailPart) {
            return {
                where: {
                    email: { [sequelize.Sequelize.Op.like]: `%${emailPart}%` }
                }
            }
        }
    }
});

module.exports = Customer;
