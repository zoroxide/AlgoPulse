const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { getGravatarURL } = require("../utils/gravatar");
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const authenticate = require("../middlewares/authenticate");
const zxcvbn = require('zxcvbn');

router.post("/register", async (req, res) => {
  const { username, name, email, password, phone, cf_handle } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      name,
      email,
      avatar: getGravatarURL(email),
      password: hashedPassword,
      phone,
      cf_handle,
      solved_problems: [],
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post("/logout", authenticate, (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;