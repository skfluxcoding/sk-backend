class AuthException extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.status = statusCode;
    }
}

module.exports = AuthException;