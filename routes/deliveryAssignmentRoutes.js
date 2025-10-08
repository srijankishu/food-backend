import express from "express";
import {authMiddleware} from "../middleware/authMiddleware.js";
import { AssignOrder,getAllAssignments,getAssignmentsForDeliveryGuy,updateAssignmentStatus,cancelAssignment } from "../controllers/deliveryAssignmentController.js";


const router = express.Router();

router.post("/",authMiddleware,AssignOrder);
router.get("/",authMiddleware,getAssignmentsForDeliveryGuy)
router.get("/admin",authMiddleware,getAllAssignments)
router.put("/:id",authMiddleware,updateAssignmentStatus)
router.delete("/:id",authMiddleware,cancelAssignment);

export default router;

