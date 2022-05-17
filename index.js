const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

/* Connect to DB  */
mongoose.connect(process.env.DB_CONNECTION).then(() => {
    console.log("connected to db");
}).catch(err => {
    console.log("error : " + err);
});

// Middlewares
app.use(express.json())

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server running !') );