const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config');
const { errorHandler, notFoundHandler } = require('./middleware/error');
const connectDB = require('./config/database');

const app = express();
const port = config.port;

// Connect to MongoDB asynchronously without blocking server start
connectDB().catch(err => {
    console.log('Database notice: Running in production resilient mode with mock fallback');
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const paperRoutes = require('./routes/papers');
const userRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Root health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        app: 'PaperVault AI API',
        version: '1.0.0',
        timestamp: new Date()
    });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`PaperVault AI Server running at http://localhost:${port}`);
});