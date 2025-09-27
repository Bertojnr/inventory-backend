import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    type: {
      type: String,
      enum: ['IN', 'OUT'],
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    date: { type: Date, default: Date.now },
    user: { type: String}, // optional: replace with userId if needed
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
