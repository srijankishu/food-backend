import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issueType: {
      type: String,
      required: true,
      enum: ["Order Issue", "Payment Issue", "Delivery Issue", "Other"],
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
    response: {
      type: String,
      default: "your issue is been resolved",
    },
  },
  { timestamps: true }
);

const SupportTicketModel = mongoose.model("SupportTicket", supportTicketSchema);

export default SupportTicketModel;
