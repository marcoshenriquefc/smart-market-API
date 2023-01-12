import express from "express";
import ListController from "../controllers/listController.js";

const router = express.Router()

router
    .get("/listProduct/seach", ListController.listAllProduct)
    .post("/listProduct", ListController.createNewList)
    .post("/listProduct/item", ListController.updateItensList)
    .put("/listProduct/removeItem", ListController.deleteItemList)
    .put("/listProduct/updateItem", ListController.updateItemList)

export default router