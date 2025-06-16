class ApiResponse {
    static success(res, data, message = 'Success', statusCode = 200) {
        if (!res) throw new Error('Missing response object (res)');
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toDateString(),
        });
    }

    static created(res, data, message = 'Resource created successfully') {
        return this.success(res, data, message, 201);
    }

    static error(res, message = 'An error occured', statusCode = 500, errors = null) {
        if (!res) throw new Error('Missing response object (res)');
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
            timestamp: new Date().toDateString(),
        });
    }

    static validationError(res, errors, message = 'Validation failed') {
        return this.error(res, message, 400, errors);
    }
}

module.exports = ApiResponse;
