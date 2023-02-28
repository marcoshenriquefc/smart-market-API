import express from "express";
import ListController from "../controllers/listController.js";
import ValidationAuth from "./validationToken.js";

const router = express.Router()

router
    .get("/listProduct/seach"       , ValidationAuth.checkToken, ListController.listAllProduct)     // Get all lists
    .post("/listProduct"            , ValidationAuth.checkToken, ListController.createNewList)      // Create a new list
    .put("/listProduct/total"       , ValidationAuth.checkToken, ListController.updateTotalList)    // Update Total list
    .put("/listProduct/saveList"    , ValidationAuth.checkToken, ListController.saveList)           // Save list

    // Item to list
    .post("/listProduct/item"       , ValidationAuth.checkToken, ListController.addItensList)       // Add item to list
    .put("/listProduct/removeItem"  , ValidationAuth.checkToken, ListController.deleteItemList)     // Remove item on list
    .put("/listProduct/updateItem"  , ValidationAuth.checkToken, ListController.updateItemList)     // Update item to list

    // Who can viu
    .post("/listProduct/addCanView"     , ValidationAuth.checkToken, ListController.addWhoCanView)     // Add new user can view the list
    .put("/listProduct/removeCanView"   , ValidationAuth.checkToken, ListController.removeWhoCanView)  // Remove user can view the list
    .get("/listProduct/getCanView"      , ValidationAuth.checkToken, ListController.getWhoCanView)     // Get all user can view the list
    .get("/listProduct/listsShared"     , ValidationAuth.checkToken, ListController.getListShared)     // Get all lists shared
    .get("/test", ListController.verifyListShared, ListController.addItensList)

export default router