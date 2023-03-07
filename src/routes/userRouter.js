import express from "express";
import { UserController } from "../controllers/userController.js";
import ValidationAuth from "./validationToken.js";


const router = express.Router();

router
    .post("/auth/register"  , UserController.registerNewUser)       // Registe new user ------ 
    .post("/auth/login"     , UserController.loginUser)             // Authentication user --- 
    .post("/auth/validation", UserController.validateUserToken)     // Valid token user
    .get("/user/put"        , UserController.addListToUser)         // 
    .get("/user"            , ValidationAuth.checkToken , UserController.userPage) // Get user --- Ok

    .get("/verifyToken"    , ValidationAuth.checkToken , UserController.verifyUserExist) // 
    // .get('/teste',  UserController.getUser)



export default router