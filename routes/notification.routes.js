import express from "express";
import {
  sendNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {adminMiddleware} from "../middleware/adminMiddleware.js"

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, sendNotification);
router.get("/", authMiddleware, getNotifications);
router.put("/:id", authMiddleware, markAsRead);
router.delete("/:id", authMiddleware, deleteNotification);

export default router;
