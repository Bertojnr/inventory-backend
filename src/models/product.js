import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: String, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    description: { type: String },
    reorderLevel: { type: Number, default: 5 }, // threshold for low-stock
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
