const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const PostModel = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userId: { // Foreign key
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'posts',
    timestamps: false
});

module.exports = PostModel;
