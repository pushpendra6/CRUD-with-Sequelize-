const sequelize = require('../Config/database'); 
const User = require('./userModel');
const Post = require('./postModel'); 
const Cart = require('./cartModel');
const Customer = require('./customerModel');
const Order = require('./orderModel');  

// Associations 1 to many
User.hasMany(Post, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Post.belongsTo(User, {
    foreignKey: 'userId'
});



//One-to-One: Customer ↔ Cart
Customer.hasOne(Cart, {
    foreignKey: 'customerId',
    onDelete: 'CASCADE',
});
Cart.belongsTo(Customer, {
    foreignKey: 'customerId'
});

// One-to-Many: Customer ↔ Orders
Customer.hasMany(Order, {
    foreignKey: 'customerId',
    onDelete: 'CASCADE',
});
Order.belongsTo(Customer, {
    foreignKey: 'customerId',
});


module.exports = {
    sequelize
};


