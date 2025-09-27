import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contact: {
      phone: { type: String, trim: true },
      email: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
