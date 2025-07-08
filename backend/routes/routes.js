const { authRouter } = require("./users");
const { articleRouter } = require("./article");

const router = require("express").Router();
router.use('/auth', authRouter);
router.use('/articles', articleRouter);

module.exports = {
    allRoutes: router
};