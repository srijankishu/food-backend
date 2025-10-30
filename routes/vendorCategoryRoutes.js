import express from "express";
import {assignFoodToCategory,getFoodByCategory,getAllCategoriesForVendor} from "../controllers/vendorCategoryController.js";
import { authMiddleware} from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

//vendor food items ko category wise assign kr diya
router.post("/food-items/:id/category",authMiddleware,authorizeRoles("vendor"),
assignFoodToCategory);

router.get(
  "/food-items/category/:categoryId", authMiddleware,authorizeRoles("vendor"),
  getFoodByCategory
);

router.get("/categories", authMiddleware, authorizeRoles("vendor"),getAllCategoriesForVendor);

export default router;
