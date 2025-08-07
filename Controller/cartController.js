const Cart = require('../Models/cartModel');
const  Customer  = require('../Models/customerModel');
//Create a cart for a customer
const createCart = async (req, res) => {
    const { customerId, totalItems, totalPrice } = req.body;

    try {
        const customer = await Customer.findByPk(customerId);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const cart = await Cart.create({ customerId, totalItems, totalPrice });
        res.status(201).json({ message: 'Cart created', cart });
    } catch (err) {
        res.status(500).json({ message: 'Error creating cart', error: err.message });
    }
};

//Get all carts
const getCarts = async (req, res) => {
    try {
        const carts = await Cart.findAll({ include: Customer });
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching carts', error: err.message });
    }
};

module.exports = {
    getCarts,
    createCart
}
