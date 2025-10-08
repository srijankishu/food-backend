import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js"
import { addIngredient, deleteIngredient, getIngredientById,getIngredients, updateIngredient } from "../controllers/ingredientController.js";

const router=express.Router();

router.post("/", authMiddleware, addIngredient);
router.get("/", authMiddleware, getIngredients);
router.get("/:id", authMiddleware, getIngredientById);
router.put("/:id", authMiddleware, updateIngredient);
router.delete("/:id", authMiddleware, deleteIngredient);

export default router;