const {UnauthorizedError, NotFoundError, InvalidArgumentError, AuthError} = require("../service_errors");
const {HTTPError} = require("../http_errors");
const {ValidationError} = require("joi");
const {UnauthorizedError: JWTUnauthorizedError} = require("express-jwt");

function errorHandlingMiddleware(err, _req, res, next) {
    if (!err) {
        return next();
    }

    if (err instanceof HTTPError) {
        res.status(err.status).json({
            message: err.message,
        });
    } else if (err instanceof ValidationError) {
        res.status(400).json({
            message: err.message,
        });
    } else if (err instanceof InvalidArgumentError) {
        res.status(400).json({
            message: err.message,
        });
    } else if (err instanceof SyntaxError) {
        res.status(400).json({
            message: err.message,
        });
    } else if (err instanceof AuthError) {
        res.status(401).json({
            message: err.message,
        });
    } else if (
        err instanceof UnauthorizedError ||
        err instanceof JWTUnauthorizedError
    ) {
        res.status(403).json({
            message: err.message,
        });
    } else if (err instanceof NotFoundError) {  // Ajout de la gestion pour NotFoundError
        res.status(404).json({
            message: err.message,
        });
    } else {
        res.status(500).json({
            message: "Something went wrong. Please try again later.",
        });

        console.error(err);
    }
}

module.exports = errorHandlingMiddleware;
