const { authRouter } = require("./users");

const router = require("express").Router();
router.use('/auth', authRouter);

module.exports = {
    allRoutes: router
};