import express from "express";
import {createCategory,getAllCategories,updateCategory,deleteCategory} from "../controllers/categoryController.js"

import {authMiddleware} from "../middleware/authMiddleware.js";
import {authorizeRoles} from "../middleware/authorizeRoles.js"
import {adminMiddleware} from "../middleware/adminMiddleware.js"

const router = express.Router();

router.get("/",getAllCategories);
router.post("/",authMiddleware,authorizeRoles("admin","vendor"),createCategory);
router.put("/:id",authMiddleware,authorizeRoles("admin","vendor"),updateCategory);
router.delete("/:id",authMiddleware,adminMiddleware,deleteCategory);

export default router;