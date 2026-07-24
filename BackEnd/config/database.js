const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.database.url);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Primary MongoDB connection error:', error.message || error);
        const localUrl = 'mongodb://127.0.0.1:27017/vpkbiet-papers';
        if (config.database.url !== localUrl) {
            console.log(`Attempting fallback to local MongoDB (${localUrl})...`);
            try {
                await mongoose.connect(localUrl);
                console.log('Local MongoDB connected successfully!');
                return;
            } catch (fallbackErr) {
                console.error('Local MongoDB connection error:', fallbackErr.message || fallbackErr);
            }
        }
        process.exit(1);
    }
};

module.exports = connectDB; 