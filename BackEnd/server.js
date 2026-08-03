const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const config = require('./config/config');
const { errorHandler, notFoundHandler } = require('./middleware/error');
const { apiRateLimiter } = require('./middleware/rateLimiter');
const connectDB = require('./config/database');

const app = express();
const port = config.port;

// Connect to MongoDB asynchronously without blocking server start
connectDB().catch(err => {
    console.log('Database notice: Running in production resilient mode with mock fallback');
});

// Security HTTP headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration with Credentials support for HTTP-only cookies
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        config.clientUrl
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parsers
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Apply rate limiter to general API calls
app.use('/api/', apiRateLimiter);

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const paperRoutes = require('./routes/papers');
const userRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/uploads');
const adminUploadRoutes = require('./routes/adminUploads');
const notificationRoutes = require('./routes/notifications');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin/uploads', adminUploadRoutes);
app.use('/api/notifications', notificationRoutes);

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