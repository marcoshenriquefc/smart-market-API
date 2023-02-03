import express from "express";
import ListController from "../controllers/listController.js";
import ValidationAuth from "./validationToken.js";

const router = express.Router()

router
    .get("/listProduct/seach"       , ValidationAuth.checkToken, ListController.listAllProduct) // Get all lists
    .post("/listProduct"            , ValidationAuth.checkToken, ListController.createNewList)  // Create a new list
    .post("/listProduct/item"       , ValidationAuth.checkToken, ListController.addItensList)   // Add item to list
    .put("/listProduct/removeItem"  , ValidationAuth.checkToken, ListController.deleteItemList) // Remove item on list
    .put("/listProduct/updateItem"  , ValidationAuth.checkToken, ListController.updateItemList) // Update item to list
    .put("/listProduct/addCanView"  , ValidationAuth.checkToken, ListController.addWhoCanView)  // Add new user can view the list
    .put("/listProduct/removeCanView"  , ValidationAuth.checkToken, ListController.removeWhoCanView)// Remove user can view the list

export default router