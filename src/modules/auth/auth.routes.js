const express = require("express");
const { signup, login, logout, resetPassword } = require("./auth.controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/reset-password", resetPassword);

module.exports = router;
