const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';
    
    res.status(statusCode).render('error', {
        title: `${statusCode} Error`,
        message: message
    });
};

const notFoundHandler = (req, res) => {
    res.status(404).render('error', {
        title: '404 Not Found',
        message: 'The page you are looking for does not exist.'
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
}; 