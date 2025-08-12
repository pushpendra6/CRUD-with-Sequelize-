const sequelize = require("../Config/database");

const Comments = sequelize.define(
    "Comments",
    {},
    {
        tableName: "Comments",
        timestamps: false
    }
);

module.exports = Comments;