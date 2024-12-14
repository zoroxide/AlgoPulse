const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const checkAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: User is not an admin' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error in admin check middleware:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = checkAdmin;