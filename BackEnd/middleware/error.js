const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';
    
    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'The page you are looking for does not exist.'
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
}; 