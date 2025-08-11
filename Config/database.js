const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('User', 'root', 'wood@123' , {
    host: "10.4.1.9",
    dialect: 'mysql',
    logging: false, 
});

module.exports = sequelize;
