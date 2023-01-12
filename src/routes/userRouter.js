import express from "express";
import UserController from "../controllers/userController.js";


const router = express.Router();

router
    .post("/auth/register", UserController.registerNewUser)
    .post("/auth/login", UserController.loginUser)
    .get('/teste', UserController.getUser)

export default router