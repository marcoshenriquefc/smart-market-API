import express from "express";
import ListController from "../controllers/listController.js";

const router = express.Router()

router
    .get("/listProduct/seach", ListController.listAllProduct)
    .post("/listProduct", ListController.createNewList)
    .post("/listProduct/item", ListController.updateItensList)
    .put("/listProduct/item", ListController.deleteItemList)

export default router