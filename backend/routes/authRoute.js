const express = require("express");
const { login, refreshToken, logout } = require("../controllers/authController");

const route = express.Router();

route.post("/login", login);
route.post("/refresh", refreshToken);
route.post("/logout", logout);

module.exports = route;