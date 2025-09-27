import Product from '../models/product.js';

// GET all products (with optional query filters)
export const getProducts = async (req, res) => {
  const { q, category, supplier, lowStock } = req.query;

  let filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  if (supplier) filter.supplierId = supplier;
  if (lowStock) filter.quantity = { $lte: '$reorderLevel' };

  const products = await Product.find(filter).populate('supplierId', 'name');
  res.json(products);
};

// GET single product
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('supplierId', 'name');
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
};

// CREATE new product
export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// UPDATE product
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
};

// DELETE product
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ message: 'Product deleted successfully' });
};
