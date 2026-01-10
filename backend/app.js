const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes Placeholders
app.get('/', (req, res) => {
  res.send('Delivery Hub API is running');
});

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);

module.exports = app;
