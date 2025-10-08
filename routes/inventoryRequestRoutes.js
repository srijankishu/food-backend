import express from "express";

import {createInventoryRequest,getAllInventoryRequests,getVendorInventoryRequests,
    updateInventoryRequestStatus,deleteInventoryRequest} from "../controllers/inventoryRequestController.js";

import {authMiddleware} from "../middleware/authMiddleware.js"
import {adminMiddleware} from "../middleware/adminMiddleware.js"


const router = express.Router();


router.post("/",authMiddleware,createInventoryRequest);
router.get("/",authMiddleware,getVendorInventoryRequests);
router.get("/admin",authMiddleware,adminMiddleware,getAllInventoryRequests);
router.put("/:id", authMiddleware,adminMiddleware, updateInventoryRequestStatus);
router.delete("/:id", authMiddleware, deleteInventoryRequest);

export default router;