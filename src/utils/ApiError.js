class ApiError extends Error {
    constructor
        (
            statusCode,
            message = "something went wrong",
            errors = [],
            stack = ""
        ) {
            super(message);
            this.statusCode = statusCode;
            this.message = message;
            this.errors = errors;
            this.data = null;
            this.success = false;
            this.stack = stack || Error.captureStackTrace(this, this.constructor)

    }

}
module.exports = {ApiError}