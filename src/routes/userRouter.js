import express from "express";
import { UserController } from "../controllers/userController.js";
import ValidationAuth from "./validationToken.js";


const router = express.Router();

router
    .post("/auth/register"  , UserController.registerNewUser)
    .post("/auth/login"     , UserController.loginUser)
    .post("/auth/validation", UserController.validateUserToken)
    .get("/user/put"        , UserController.addListToUser)
    .get("/user/:id"        , ValidationAuth.checkToken , UserController.userPage)
    // .get('/teste',  UserController.getUser)



export default router