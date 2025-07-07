const { validationResult } = require("express-validator");

// Middleware to handle validation errors
const validatorHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: "error",
            message: "Validation failed",
            errors: errors.array()
        });
    }
    next();
};

module.exports={
    validatorHandler
};