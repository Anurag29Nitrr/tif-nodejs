const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const config = require('../config');

const router = express.Router();

// Sign Up
router.post('/v1/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!validator.isEmail(email) || !password || password.length < 6) {
    return res.status(400).json({ status: false, error: { message: 'INVALID_INPUT' } });
  }

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ status: false, error: { message: 'EMAIL_ALREADY_EXISTS' } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      status: true,
      content: { data: { id: user.id, name: user.name, email: user.email, created_at: user.created_at } },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: { message: 'INTERNAL_SERVER_ERROR' } });
  }
});

// Sign In
router.post('/v1/auth/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email) || !password) {
    return res.status(400).json({ status: false, error: { message: 'INVALID_INPUT' } });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ status: false, error: { message: 'INVALID_CREDENTIALS' } });
    }

    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '24h' });
    res.json({
      status: true,
      content: { data: { id: user.id, name: user.name, email: user.email, created_at: user.created_at }, meta: { access_token: token } },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: { message: 'INTERNAL_SERVER_ERROR' } });
  }
});

// Get Me
router.get('/v1/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id }).select('-password');
    res.json({
      status: true,
      content: { data: { id: user.id, name: user.name, email: user.email, created_at: user.created_at } },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: { message: 'INTERNAL_SERVER_ERROR' } });
  }
});

module.exports = router;