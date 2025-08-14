const express = require("express")
const userRoutes = require("./Routes/userRoutes");
const cartRoutes =  require("./Routes/cartRoutes");
const orderRoutes =  require("./Routes/orderRoutes");
const customerRoutes =  require("./Routes/customerRoutes");
const { sequelize} = require('./Models/index')
const postRoutes = require('./Routes/postRoutes');
const app = express();
const userRoute1 = require('./Routes/user1Routes');
const commentRoutes = require('./Routes/commentRoutes');
const emailRoute = require('./Routes/emailRoute');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/customer', customerRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/user1',userRoute1);
app.use('/email', emailRoute);
app.use('/comment', commentRoutes);


//alter: false → don’t change columns or structure.
//force: false → don’t drop and recreate the table.
sequelize.sync({ alter: false, force: false }) 
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


