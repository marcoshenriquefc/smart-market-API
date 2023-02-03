import express from "express";
import ListController from "../controllers/listController.js";
import ValidationAuth from "./validationToken.js";

const router = express.Router()

router
    .get("/listProduct/seach"       , ValidationAuth.checkToken, ListController.listAllProduct) //Get all lists
    .post("/listProduct"            , ValidationAuth.checkToken, ListController.createNewList)
    .post("/listProduct/item"       , ValidationAuth.checkToken, ListController.updateItensList)
    .put("/listProduct/removeItem"  , ValidationAuth.checkToken, ListController.deleteItemList)
    .put("/listProduct/updateItem"  , ValidationAuth.checkToken, ListController.updateItemList)

export default router