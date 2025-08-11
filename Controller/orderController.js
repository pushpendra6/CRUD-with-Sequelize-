const  Order = require('../Models/orderModel');
const  Customer  = require('../Models/customerModel');
const sequelize = require('../Config/database');

//Create an order for a customer
const createOrder = async (req, res) => {
    const { customerId, productName, price, quantity } = req.body;
    console.log(customerId,productName,price,quantity);

    try {
        const customer = await Customer.findByPk(customerId);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const order = await Order.create({ customerId, productName, price, quantity });
        res.status(201).json({ message: 'Order created', order });
    } catch (err) {
        res.status(500).json({ message: 'Error creating order', error: err.message });
    }
};

//Get all orders
const getOrders = async (req, res) => {
    try {
        const [orders] = await sequelize.query('SELECT * FROM Orders');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders', error: err.message });
    }
};

module.exports = {
    createOrder,
    getOrders
}
