require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => console.error('An error occurred connecting to MongoDB:', err));

module.exports = {
    User: require('../model/userModel.js'),
};