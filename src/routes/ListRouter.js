import express from "express";
import ListController from "../controllers/listController.js";

const router = express.Router()

router
    .get("/listItens/seach", ListController.listAllProduct)
    .post("/listProduct", ListController.createNewList)

export default router