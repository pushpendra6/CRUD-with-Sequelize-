const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    
},{
    tableName: 'Orders',
    createdAt:true,
    updatedAt:true,
    
});

module.exports = Order;
