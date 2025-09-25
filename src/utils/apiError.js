class ApiError extends Error {
    constructor(message, statusCode, errors = []) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            success: false,
            message: this.message,
            ...(this.errors > 0 && { errors: this.errors }),
        };
    }
}

module.exports = ApiError;
