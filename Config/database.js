const { Sequelize } = require('sequelize');
require('dotenv').config();


const dbUsername = process.env.USERNAME;
const dbPassword = process.env.PASSWORD;
const dbHost = process.env.HOST;

const sequelize = new Sequelize('User', dbUsername, dbPassword , {
    host: dbHost,
    dialect: 'mysql',
    logging: false, 
});

module.exports = sequelize;
