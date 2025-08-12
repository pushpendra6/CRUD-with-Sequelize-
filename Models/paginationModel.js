const sequelize = require("../Config/database");
const { DataTypes } = require('sequelize');

const Comments = sequelize.define(
    "Comments",
    {  
        id: {
            type: DataTypes.INTEGER,
            allowNull: true, // since DB column allows NULL
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        body: {
            type: DataTypes.STRING(542),
            allowNull: true
        }
    },
    {
        tableName: "Comments",
        timestamps: false
    }
);

module.exports = Comments;