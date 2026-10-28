const express = require('express');
const cors = require('cors');
const authenRoutes = require('./routes/authen');
const menuRoutes = require('./routes/menuRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes Mounting
app.use('/authen', authenRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
