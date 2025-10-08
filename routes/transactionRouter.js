import express from 'express';

import {createTransaction,getTransactionById,getTransactions,updateTransaction,
deleteTransaction} from "../controllers/transactionController.js";

import {authMiddleware} from "../middleware/authMiddleware.js";
import {adminMiddleware} from "../middleware/adminMiddleware.js"

const router = express.Router();

router.post("/",authMiddleware,createTransaction);
router.get("/",authMiddleware,getTransactions);
router.get("/:id",authMiddleware,getTransactionById);
router.put("/:id", authMiddleware,adminMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTransaction);


export default router;