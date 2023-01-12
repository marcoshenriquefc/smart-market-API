import express from "express";
import {UserController, UserValidation} from "../controllers/userController.js";


const router = express.Router();

router
    .post("/auth/register", UserController.registerNewUser)
    .post("/auth/login", UserController.loginUser)
    .get('/teste',  UserController.getUser)
    .get("/user/:id", UserValidation.checkToken , UserController.userPage)



export default router