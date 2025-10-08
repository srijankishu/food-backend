import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["ID_PROOF", "FOOD_LICENSE", "OTHER"],
  },
  file: {
    type: String,
    required: true, // Can store URL or Base64
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});


const vendorDocumentSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming Vendor is stored in User collection
      required: true,
    },
    documents: [documentSchema],
  },
  { timestamps: true }
);

export const VendorDocument = mongoose.model("VendorDocument", vendorDocumentSchema);
