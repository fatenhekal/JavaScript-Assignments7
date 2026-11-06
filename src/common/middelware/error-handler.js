export const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error?.code === 11000) {
        return res.status(409).json({ message: "Email already exists." });
    }

    if (error?.name === "ValidationError") {
        return res.status(400).json({
            message: "Validation failed.",
            errors: Object.values(error.errors).map(({ path, message }) => ({ path, message }))
        });
    }

    if (error?.name === "CastError") {
        return res.status(400).json({ message: `Invalid value for ${error.path}.` });
    }

    const statusCode = Number.isInteger(error?.statusCode)
        ? error.statusCode
        : Number.isInteger(error?.status)
            ? error.status
            : 500;
    if (statusCode >= 500) {
        console.error("Request failed:", error);
    }

    return res.status(statusCode).json({
        message: statusCode >= 500 ? "Internal server error." : error.message || "Invalid request."
    });
};
