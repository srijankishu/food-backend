import express from "express";
import {authMiddleware} from "../middleware/authMiddleware.js"
import {cancelOrder, createOrder, getCompletedOrders, getOrderById, getOrders, updateOrderStatus} from "../controllers/orderController.js"

const router = express.Router();

router.post("/", authMiddleware, createOrder)
router.get("/", authMiddleware, getOrders)
router.get("/public", authMiddleware, getCompletedOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id/status", authMiddleware, updateOrderStatus);
router.delete("/:id", authMiddleware, cancelOrder);



export default router;