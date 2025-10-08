import mongoose from "mongoose";

const deliveryAssignmentSchema = new mongoose.Schema({
  
    orderId: {
        type:mongoose.Schema.ObjectId,
        ref:"Order",
        required:true
    },

    deliveryGuyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming delivery guys are also in Users
      required: true,
    },

    assignedBy: {
      type: String,
      enum: ["admin", "vendor"],
      required: true,
    },

    status: {
      type: String,
      enum: ["assigned", "picked", "delivered"],
      default: "assigned",
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },

    deliveredAt: {
      type: Date,
    },

  },
  { timestamps: true }
);

export default mongoose.model("DeliveryAssignment", deliveryAssignmentSchema);
