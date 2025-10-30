import {Setting} from "../models/Setting.js"


// ✅ Get settings (any role can view)
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update settings (Admin only)
export const updateSettings = async (req, res) => {
  try {
    const { taxRate, deliveryCharge, commissionPercentage } = req.body;

    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({ taxRate, deliveryCharge, commissionPercentage });
    } else {
      settings.taxRate = taxRate ?? settings.taxRate;
      settings.deliveryCharge = deliveryCharge ?? settings.deliveryCharge;
      settings.commissionPercentage = commissionPercentage ?? settings.commissionPercentage;
      await settings.save();
    }

    res.status(200).json({ message: "Settings updated successfully", settings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
