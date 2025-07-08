const { registerUser, verifyEmail, login, validateUser } = require("../controllers/users");
const { validatorHandler } = require("../validators/commonvalidator");
const { registerUserValidator, loginValidation } = require("../validators/userValidator");

const router = require("express").Router();

router.post("/signup", registerUserValidator, validatorHandler, registerUser);
router.get("/verify/:token", verifyEmail);
router.post("/login", loginValidation, validatorHandler, login);
router.get("/validuser", validateUser);

module.exports = {
    authRouter: router
};