const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
