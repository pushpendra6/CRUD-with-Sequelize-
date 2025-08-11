const Customer = require('../Models/customerModel');
const Cart = require('../Models/cartModel');
const Order = require('../Models/orderModel');
const sequelize = require("../Config/database");

//Create new customer
const createCustomer = async (req, res) => {
  const { fullName, email } = req.body;
  console.log("in customer create method");
  try {
    const existing = await Customer.findOne({ where: { email }, });

    if (existing ) {
        return res
            .status(400)
            .json({ message: `Customer already exists with this ${email}` });
    }

    const customer = await Customer.create({ fullName, email });
    res.status(201).json({ message: "Customer created", customer });
    } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating customer", error: err.message });
  }
};

const createCustomerRaw = async(req,res) => {
    const { fullName, email } = req.body;
    try{
        const [existing] = await sequelize.query(`SELECT email FROM Customers WHERE email = :email LIMIT 1`,{
            replacements: { email },
            type: sequelize.QueryTypes.SELECT,
        });
        if (existing ) {
            return res
                .status(400)
                .json({ message: `Customer already exists with this ${email}` });
        }
        const [customerId] = await sequelize.query('INSERT INTO Customers (fullName, email) VALUES (:fullName, :email)',{
            replacements: {fullName,email},
            type: sequelize.QueryTypes.INSERT
        });
        res.status(201).json({ message: "Customer created", customerId });
    }catch(err){
        console.log("error")
    }
}

//Get all customers
const getCustomersLeft = async (req, res) => {
  console.log("in get customer ");
  try {
    console.log("before fetching data");
    const [customers] = await sequelize.query(`
        SELECT 
            Customers.id AS customerId,
            Customers.fullName,
            Customers.email,
            Carts.id AS cartId,
            Carts.totalItems,
            Carts.totalPrice,
            Orders.id AS orderId,
            Orders.productName,
            Orders.price,
            Orders.quantity
        FROM 
            Customers
        LEFT JOIN 
            Carts ON Carts.customerId = Customers.id
        LEFT JOIN 
            Orders ON Orders.customerId = Customers.id;
       `);
    console.log("data fetched");
    res.status(200).json(customers);
  } catch (err) {
    console.error("Error fetching data:", err);
    res
      .status(500)
      .json({ message: "Error fetching customer data", error: err.message });
  }
};

// Get customers using INNER JOIN (only those who have carts AND orders)
const getCustomersWithInnerJoin = async (req, res) => {
  console.log("in getCustomersWithInnerJoin");
  try {
    console.log("before fetching data with inner join");
    const [customers] = await sequelize.query(`
        SELECT 
            Customers.id,
            Customers.fullName,
            Customers.email,
            Carts.id,
            Carts.totalItems,
            Carts.totalPrice,
            Orders.id,
            Orders.productName,
            Orders.price,
            Orders.quantity
        FROM 
            Customers
        INNER JOIN 
            Carts ON Carts.customerId = Customers.id
        INNER JOIN 
            Orders ON Orders.customerId = Customers.id;
    `);
    console.log("data fetched with inner join");
    res.status(200).json(customers);
  } catch (err) {
    console.error("Error fetching data:", err);
    res
      .status(500)
      .json({ message: "Error fetching customer data", error: err.message });
  }
};

// Get customers using RIGHT JOIN (structure reversed to match LEFT JOIN output) (Paranoid)
const getCustomersWithRightJoin = async (req, res) => {
  console.log("in getCustomersWithRightJoin");
  try {
    console.log("before fetching data with right join");
    const [customers] = await sequelize.query(`
        SELECT 
            Customers.id,
            Customers.fullName,
            Customers.email,
            Carts.id,
            Carts.totalItems,
            Carts.totalPrice,
            Orders.id,
            Orders.productName,
            Orders.price,
            Orders.quantity
        FROM 
            Carts
        RIGHT JOIN 
            Customers ON Carts.customerId = Customers.id
        LEFT JOIN 
            Orders ON Orders.customerId = Customers.id;
    `);
    console.log("data fetched with right join");
    res.status(200).json(customers);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ message: "Error fetching customer data", error: err.message });
  }
};

const getCustmerOnly = async(req,res) => {
    try {
        const [customer] = await sequelize.query(`SELECT * FROM Customers`)
        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customers', error: err.message });
    }
}


const deleteCustomer = async (req, res) => {
    console.log("in delete 1");
	try {
		const customerId = req.params.id;
        console.log(customerId);
		const result = await sequelize.query(' DELETE FROM Customers WHERE id = :customerId',{
            replacements: {customerId},
            type: sequelize.QueryTypes.DELETE,
        })

		if (result === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }
        console.log("in delete 2");
		res.status(200).json({ message: "Customer deleted successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error deleting Customer", error: error.message });
	}
};

const getCustomerWithDeleted = async (req, res) => {
    try {
        console.log('in getCustomerWithDeleted');
        const customer = await Customer.findAll({
            paranoid: false // This includes soft-deleted rows
        });
        res.status(200).json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ message: 'Error fetching customer', error: error.message });
    }
};


//Association methods 
// Create Customer with associations
const createCustomerWithCartAndOrders = async (req, res) => {
  try {
    const customerData = req.body;

    const customer = await Customer.create(customerData, {
      include: [
        { model: Cart }, // One-to-One
        { model: Order } // One-to-Many
      ]
    });

    res.status(201).json({
      message: 'Customer, Cart, and Orders created successfully',
      data: customer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get Customer with Cart and Orders
const getCustomerWithCartAndOrders = async (req, res) => {
  try {
    const id = req.params.id
    console.log(id);
    const customer = await Customer.findByPk(req.params.id, {
      include: [
        { model: Cart },
        { model: Order }
      ]
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
    getCustmerOnly,
  getCustomersLeft,
  createCustomer,
  createCustomerRaw,
  getCustomersWithInnerJoin,
  getCustomersWithRightJoin,
  deleteCustomer,
  getCustomerWithDeleted,
  createCustomerWithCartAndOrders,
  getCustomerWithCartAndOrders
};
