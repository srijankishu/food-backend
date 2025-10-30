import express from 'express'
import {getSettings,updateSettings} from "../controllers/settingController.js";
import {adminMiddleware} from "../middleware/adminMiddleware.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",getSettings);
router.put("/",authMiddleware,adminMiddleware,updateSettings);

export default router;