const  Customer  = require('../Models/customerModel');
const  Order  = require('../Models/orderModel');
const  Cart = require('../Models/cartModel');

//Create new customer
const createCustomer = async (req, res) => {
    const { fullName, email } = req.body;
    console.log("in customer create method");
    try {
        const existing = await Customer.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: `Customer already exists with this ${email}` });
        }

        const customer = await Customer.create({ fullName, email });
        res.status(201).json({ message: 'Customer created', customer });
    } catch (err) {
        res.status(500).json({ message: 'Error creating customer', error: err.message });
    }
};

//Get all customers
const getCustomers = async (req, res) => {
    console.log("in customer get method");
    try {
        const customers = await Customer.findAll({
            include: [Cart, Order]
        });
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customers', error: err.message });
    }
};


module.exports = {
    getCustomers,
    createCustomer,
}