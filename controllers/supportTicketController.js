import SupportTicketModel from "../models/supportTicketModel.js";

export const createSupportTicket = async (req, res) => {
  try {
    const { issueType, message } = req.body;

    if (!issueType || !message) {
      return res.status(400).json({ msg: "Issue type and message are required" });
    }

    const ticket = await SupportTicketModel.create({
      userId: req.user.id,
      issueType,
      message,
    });

    res.status(201).json({
      message: "Support ticket created successfully.",
      ticketId: ticket._id,
      status: ticket.status,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getUserSupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicketModel.find({ userId: req.user.id });
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getAllSupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicketModel.find().populate("userId", "name email role");
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


export const updateSupportTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const ticket = await SupportTicketModel.findById(id);
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    if (status) ticket.status = status;
    if (response) ticket.response = response;

    await ticket.save();

    res.json({
      message: "Support ticket updated successfully.",
      ticketId: ticket._id,
      newStatus: ticket.status,
      response: ticket.response,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const deleteSupportTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await SupportTicketModel.findByIdAndDelete(id);

    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    res.json({ message: "Support ticket deleted successfully." });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};