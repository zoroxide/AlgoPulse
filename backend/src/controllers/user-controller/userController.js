const User = require("../../models/User");
const { getGravatarURL } = require("../../utils/gravatar");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/jwt");

module.exports = {
  register: async (req, res) => {
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
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to register user" });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
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
          avatar: user.avatar,
        },
      });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  logout: (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ message: "Logged out successfully" });
    });
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: `internal server error, ${err}` });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Error fetching users", error: err.message });
    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Error fetching user", error: err.message });
    }
  },
};