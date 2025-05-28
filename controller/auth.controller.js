const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Token = require('../models/Token');

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET);

    await new Token({
      userId: user._id,
      token: refreshToken,
      type: 'refresh',
    }).save();

    res.status(201).send({ user, accessToken, refreshToken });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET);

    await new Token({
      userId: user._id,
      token: refreshToken,
      type: 'refresh',
    }).save();

    res.send({ user, accessToken, refreshToken });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).send({ error: 'Refresh token required' });

  try {
    const tokenDoc = await Token.findOne({ token: refreshToken });
    if (!tokenDoc) return res.status(401).send({ error: 'Invalid refresh token' });

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.send({ accessToken });
  } catch (error) {
    res.status(401).send({ error: 'Invalid refresh token' });
  }
};

exports.logout = async (req, res) => {
  try {
    await Token.deleteOne({ token: req.body.refreshToken });
    res.send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Logout failed' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send({ error: 'User not found' });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, { expiresIn: '1h' });

    await new Token({
      userId: user._id,
      token: resetToken,
      type: 'reset',
    }).save();

    // Send resetToken by email in real implementation
    res.send({ resetToken, message: 'Password reset token created' });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const tokenDoc = await Token.findOne({ token: resetToken, type: 'reset' });
    if (!tokenDoc) return res.status(401).send({ error: 'Invalid token' });

    const payload = jwt.verify(resetToken, process.env.JWT_RESET_SECRET);

    const user = await User.findById(payload.id);
    user.password = newPassword;
    await user.save();

    await Token.deleteOne({ token: resetToken });

    res.send({ message: 'Password reset successful' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token expired' });
    }
    res.status(401).send({ error: 'Invalid token' });
  }
};
