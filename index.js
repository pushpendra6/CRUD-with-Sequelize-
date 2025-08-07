const express = require("express")
const userRoutes = require("./Routes/userRoutes");
const cartRoutes =  require("./Routes/cartRoutes");
const orderRoutes =  require("./Routes/orderRoutes");
const customerRoutes =  require("./Routes/customerRoutes");
const { sequelize} = require('./Models/index')
const postRoutes = require('./Routes/postRoutes');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/customer', customerRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);


sequelize.sync({ alter : false }) 
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Unable to connect to the database or sync models:', err);
    });


// Start Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});


