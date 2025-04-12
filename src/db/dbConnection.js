const mongoose = require('mongoose');
const DB_Name = require('../constants');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.DBURL}/${DB_Name}`);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(DB_Name);

        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit with failure
    }
};

module.exports = connectDB;
