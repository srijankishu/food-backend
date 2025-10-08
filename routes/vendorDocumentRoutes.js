import express from 'express';

import {uploadVendorDocuments,getVendorDocuments, getAllVendorDocuments, updateDocumentStatus, deleteVendorDocument} from "../controllers/vendorDocumentController.js";

import {authMiddleware} from "../middleware/authMiddleware.js";

import {adminMiddleware} from "../middleware/adminMiddleware.js";
const router = express.Router();

router.post("/",authMiddleware,uploadVendorDocuments);
router.get("/",authMiddleware,getVendorDocuments);
router.get("/admin",authMiddleware,adminMiddleware,getAllVendorDocuments);
router.put("/:id",authMiddleware,adminMiddleware,updateDocumentStatus);
router.delete("/:id",authMiddleware,deleteVendorDocument);

export default router;
