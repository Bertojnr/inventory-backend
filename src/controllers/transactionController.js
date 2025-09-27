import Transaction from '../models/transaction.js';
import Product from '../models/product.js';

// Get all transactions
export const getTransactions = async (req, res) => {
  const transactions = await Transaction.find().populate('product');
  res.json(transactions);
};

// Get single transaction
export const getTransactionById = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id).populate('product');
  if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
  res.json(transaction);
};

// Create transaction (and update stock)
export const createTransaction = async (req, res) => {
  try {
    const { productId, type, quantity, reference, user } = req.body;

    const productDoc = await Product.findById(productId);
    if (!productDoc) return res.status(404).json({ error: "Product not found" });

    if (type === "OUT" && productDoc.quantity < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    // Adjust product stock
    if (type === "IN") {
      productDoc.quantity += quantity;
    } else {
      productDoc.quantity -= quantity;
    }
    await productDoc.save();

    // ✅ Notice we use `product: productId` instead of `productId`
    const transaction = await Transaction.create({
      product: productId,
      type,
      quantity,
      reference,
      user,  // still required (string for now)
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
};



// Update transaction (⚠️ rare in real systems, stock might need adjustment)
export const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
  res.json(transaction);
};

// Delete transaction (⚠️ might require reversing stock)
export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);
  if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
  res.json({ message: 'Transaction deleted' });
};
