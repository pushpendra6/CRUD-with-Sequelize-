const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    totalItems: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
});

module.exports = Cart;
