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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
