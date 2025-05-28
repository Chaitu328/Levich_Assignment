const express = require('express');
const authRoutes = require('./routes/auth.route');
const commentRoutes = require('./routes/comments.route');
const permissionRoutes = require('./routes/permissions.route');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/comments', commentRoutes);
app.use('/permissions', permissionRoutes);

module.exports = app;
