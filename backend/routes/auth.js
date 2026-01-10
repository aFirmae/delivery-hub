const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, user_type } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
      user_type: user_type || 'sender'
    });

    const token = jwt.sign(
      { id: userId, email, user_type: user_type || 'sender' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({
      id: userId,
      email,
      name,
      phone,
      user_type: user_type || 'sender',
      token,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      token,
      user_type: user.user_type
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
