import express from "express";
import ListController from "../controllers/listController.js";
import ValidationAuth from "./validationToken.js";

const router = express.Router()

router
    .get("/listProduct/search"      , ValidationAuth.checkToken, ListController.listAllProduct)                                     // Get all lists -------- OK
    .get("/listProduct/singleList"  , ValidationAuth.checkToken, ListController.verifyifCanEdit, ListController.singleListProduct)  // Get single lists ----- 
    .post("/listProduct"            , ValidationAuth.checkToken, ListController.createNewList)                                      // Create a new list ---- OK
    .put("/listProduct/total"       , ValidationAuth.checkToken, ListController.verifyifCanEdit, ListController.updateTotalList)    // Update Total list ---- OK
    .put("/listProduct/saveList"    , ValidationAuth.checkToken, ListController.verifyifCanEdit, ListController.saveList)           // Save list  ----------- OK

    // Item to list
    .post("/listProduct/item"       , ValidationAuth.checkToken, ListController.verifyifCanEdit, ListController.addItensList)       // Add item to list ----- OK
    .put("/listProduct/updateItem"  , ValidationAuth.checkToken, ListController.verifyifCanEdit, ListController.updateItemList)     // Update item to list -- OK
    .put("/listProduct/removeItem"  , ValidationAuth.checkToken, ListController.verifyifCanEdit, ListController.deleteItemList)     // Remove item on list -- OK

    // Who can viu
    .post("/listProduct/addCanView"     , ValidationAuth.checkToken, ListController.verifyIfisOwner, ListController.addWhoCanView)      // Add user can view the list ------ OK
    .get("/listProduct/getCanView"      , ValidationAuth.checkToken, ListController.verifyifCanEdit, ListController.getWhoCanView)      // Get all user can view the list -- OK
    .put("/listProduct/removeCanView"   , ValidationAuth.checkToken, ListController.verifyIfisOwner, ListController.removeWhoCanView)   // Remove user can view the list --- OK
    .get("/listProduct/listsShared"     , ValidationAuth.checkToken, ListController.getListShared)                                      // Get all lists shared ------------ OK

export default router