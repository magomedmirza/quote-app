import express from "express";
import { login, refreshToken, logout } from "../controllers/authController.js";

const route = express.Router();

route.post("/login", login);
route.post("/refresh", refreshToken);
route.post("/logout", logout);
export default route;
