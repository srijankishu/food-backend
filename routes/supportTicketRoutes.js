import express from "express";
import {
  createSupportTicket,
  getUserSupportTickets,
  getAllSupportTickets,
  updateSupportTicket,deleteSupportTicket
} from "../controllers/supportTicketController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSupportTicket);
router.get("/", authMiddleware, getUserSupportTickets);
router.get("/admin", authMiddleware,adminMiddleware, getAllSupportTickets);
router.put("/:id", authMiddleware,adminMiddleware, updateSupportTicket);
router.delete("/:id", authMiddleware,adminMiddleware, deleteSupportTicket);




export default router;