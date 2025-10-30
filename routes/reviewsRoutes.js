import express from "express";
import {authMiddleware} from "../middleware/authMiddleware.js"
import {creatReview,getMyReviews,updateReview,deleteReview} from "../controllers/reviewController.js"
const router= express.Router();

router.post("/",authMiddleware,creatReview);
router.get("/",authMiddleware,getMyReviews);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;