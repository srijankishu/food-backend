import Transaction from "../models/transactionsModel.js";



export const createTransaction = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod, status } = req.body;

    const transaction = await Transaction.create({
      orderId,
      userId: req.user.id, // comes from authMiddleware
      amount,
      paymentMethod,
      status,
    });

    res.status(201).json({
      message: "Transaction recorded successfully.",
      transactionId: transaction._id,
      status: transaction.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).populate("orderId");

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate("orderId");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//admin only
export const updateTransaction = async (req, res) => {
  try {
    const { status } = req.body;

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.status = status;
    await transaction.save();

    res.json({
      message: "Transaction status updated successfully.",
      transactionId: transaction._id,
      newStatus: transaction.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//admin only
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
