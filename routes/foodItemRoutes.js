import express from "express";
import { CreateFoodItems,getMyFoodItems,updateFoodItem,deleteFoodItem,getAllFoodItems } from "../controllers/foodItemController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, CreateFoodItems);
router.get("/", authMiddleware, getMyFoodItems); 
router.put("/:id", authMiddleware, updateFoodItem); 
router.delete("/:id", authMiddleware, deleteFoodItem); 
router.get("/public", getAllFoodItems); 


export default router;

