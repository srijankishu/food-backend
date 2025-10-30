import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from "../middleware/adminMiddleware.js"
import { deleteUser, getAllUsers, getProfile, updateProfile } from '../controllers/userController.js';



const router= express.Router();

router.get("/me",authMiddleware,getProfile)
router.put("/me/profile",authMiddleware,updateProfile);
router.delete("/me",authMiddleware,deleteUser);
router.get("/all", authMiddleware, adminMiddleware, getAllUsers);

export default router;

