import express from "express";
import { register, login, isLogin } from "../controllers/auth.js";
import { isAuthenticated } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/isLogin", isAuthenticated, isLogin)

export default router
