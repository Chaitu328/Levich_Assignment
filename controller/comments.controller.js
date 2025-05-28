const Comment = require('../models/Comments');

// Create a comment
exports.createComment = async (req, res) => {
  try {
    if (!req.user.permissions.write) {
      return res.status(403).send({ error: 'No write permission' });
    }
    const comment = new Comment({ ...req.body, user: req.user._id });
    await comment.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(500).send({ error: 'Failed to create comment' });
  }
};

// Get all comments
exports.getComments = async (req, res) => {
  try {
    if (!req.user.permissions.read) {
      return res.status(403).send({ error: 'No read permission' });
    }
    const comments = await Comment.find().populate('user', 'name');
    res.send(comments);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve comments' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    if (!req.user.permissions.delete) {
      return res.status(403).send({ error: 'No delete permission' });
    }
    await Comment.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete comment' });
  }
};
