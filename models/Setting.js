import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  taxRate: {
    type: Number,
    default: 0,
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
  commissionPercentage: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export const Setting = mongoose.model("Setting", settingSchema);
