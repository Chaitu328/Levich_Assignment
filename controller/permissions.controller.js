const User = require('../models/User');

// Update user permissions and admin status
exports.updateUserPermissions = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send({ error: 'User not found' });

    // Update permissions
    if (req.body.permissions) {
      user.permissions = {
        ...user.permissions,
        ...req.body.permissions,
      };
    }

    // Update admin status
    if (typeof req.body.isAdmin === 'boolean') {
      user.isAdmin = req.body.isAdmin;
    }

    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};
