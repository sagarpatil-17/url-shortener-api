
const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";

    // MongoDB duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        message = "Resource already exists";
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Database validation failed";
    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID";
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),
    });
};

export default errorMiddleware;
