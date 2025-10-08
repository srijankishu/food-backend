import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { deleteUser, getProfile, updateProfile } from '../controllers/userController.js';



const router= express.Router();

router.get("/me",authMiddleware,getProfile)
router.put("/me",authMiddleware,updateProfile);
router.delete("/me",authMiddleware,deleteUser);

//router.get("/all", authMiddleware, roleMiddleware(["admin"]), getAllUsers);
export default router;

