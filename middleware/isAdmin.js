const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).send({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).send({ error: 'Permission check failed' });
  }
};

module.exports = isAdmin;
