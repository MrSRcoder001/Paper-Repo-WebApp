const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const config = require('./config/config');
const { errorHandler, notFoundHandler } = require('./middleware/error');
const connectDB = require('./config/database');

const app = express();
const port = config.port;

// Connect to MongoDB
connectDB();

// Set EJS as the view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('/views', path.join(__dirname, '../BackEnd/views'));


// Serve static files
app.use(express.static(path.join(__dirname, '../FrontEnd')));
app.use('/images', express.static(path.join(__dirname, '../FrontEnd/images')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Flash messages
app.use(flash());

// Custom middleware to add path and flash messages to all routes
app.use((req, res, next) => {
    res.locals.path = req.path;
    res.locals.messages = req.flash();
    res.locals.user = req.session.user || null;
    next();
});

// Import routes
const authRoutes = require('./routes/auth');
const paperRoutes = require('./routes/papers');
const userRoutes = require('./routes/users');

// Use routes
app.use('/', authRoutes);
app.use('/papers', paperRoutes);
app.use('/users', userRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});