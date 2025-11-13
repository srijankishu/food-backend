import { Notification } from "../models/notification.model.js";
import  User  from "../models/User.js";

// POST /notifications
export const sendNotification = async (req, res) => {
  try {
    const { recipientType, recipientId, title, message, type, role } = req.body;

    if (recipientType === "user" && !recipientId) {
      return res.status(400).json({ message: "recipientId is required for type 'user'" });
    }

    if (recipientType === "role" && !role) {
      return res.status(400).json({ message: "role is required for type 'role'" });
    }

    let recipients = [];

    if (recipientType === "user") {
      recipients = [recipientId];
    } else if (recipientType === "role") {
      const users = await User.find({ role }).select("_id");
      recipients = users.map(u => u._id);
    } else if (recipientType === "all") {
      const users = await User.find().select("_id");
      recipients = users.map(u => u._id);
    }

    const notifications = await Promise.all(
      recipients.map(id =>
        Notification.create({ recipientType, recipientId: id, title, message, type })
      )
    );

    res.status(201).json({
      message: "Notification(s) sent successfully.",
      count: notifications.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error sending notification", error: error.message });
  }
};

// GET /notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
};

// PUT /notifications/:id
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "read" or "unread"

    const isRead = status === "read"; // convert to boolean

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification marked as read.",
      notificationId: id,
      newStatus: status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating notification",
      error: error.message,
    });
  }
};


// DELETE /notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);

    res.status(200).json({ message: "Notification deleted successfully.", notificationId: id });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error: error.message });
  }
};
