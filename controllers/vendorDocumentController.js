import { VendorDocument } from "../models/vendorDocumentModel.js";

export const uploadVendorDocuments = async (req, res) => {
  try {
    const { vendorId, documents } = req.body;

    if (req.user.role !== "vendor") {
      return res.status(403).json({ msg: "Not authorized to update the document" });
    }

    if (!vendorId || !documents || !Array.isArray(documents)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const existingDoc = await VendorDocument.findOne({ vendorId });

    if (existingDoc) {
      existingDoc.documents.push(...documents);
      await existingDoc.save();
      return res.status(200).json({
        message: "Documents added successfully.",
        vendorId,
      });
    }

    const newDoc = await VendorDocument.create({ vendorId, documents });

    res.status(201).json({
      message: "Documents uploaded successfully.",
      vendorId: newDoc.vendorId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getVendorDocuments = async (req, res) => {
  try {
    const vendorId = req.user.id; // from auth middleware
  //  console.log(vendorId);
  
    if (req.user.role !== "vendor") {
      return res.status(403).json({ msg: "Not authorized to see the document" });
    }
    const vendorDocs = await VendorDocument.findOne({ vendorId });
    if (!vendorDocs)
      return res.status(404).json({ message: "No documents found." });

    res.status(200).json(vendorDocs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllVendorDocuments = async (req, res) => {
  try {
    const allDocs = await VendorDocument.find().populate("vendorId", "name email");
    res.status(200).json({ vendorDocuments: allDocs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateDocumentStatus = async (req, res) => {
  try {
    const { id } = req.params; // document _id
    const { status } = req.body;

    const vendorDoc = await VendorDocument.findOneAndUpdate(
      { "documents._id": id },
      { $set: { "documents.$.status": status } },
      { new: true }
    );

    if (!vendorDoc)
      return res.status(404).json({ message: "Document not found" });

    res.status(200).json({
      message: "Document status updated successfully.",
      documentId: id,
      newStatus: status,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteVendorDocument = async (req, res) => {
  try {
    const { id } = req.params; // document _id
    const vendorId = req.user.id;
   // console.log(vendorId);
    const vendorDoc = await VendorDocument.findOne({ vendorId });
    if (!vendorDoc) return res.status(404).json({ message: "No documents found" });

    vendorDoc.documents = vendorDoc.documents.filter(
      (doc) => doc._id.toString() !== id
    );

    await vendorDoc.save();
    res.status(200).json({ message: "Document deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};