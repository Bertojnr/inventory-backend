import Supplier from '../models/supplier.js';

// Get all suppliers
export const getSuppliers = async (req, res) => {
  const suppliers = await Supplier.find();
  res.json(suppliers);
};

// Get supplier by ID
export const getSupplierById = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    return res.status(404).json({ error: 'Supplier not found' });
  }
  res.json(supplier);
};

// Create supplier
export const createSupplier = async (req, res) => {
  const supplier = await Supplier.create(req.body);
  res.status(201).json(supplier);
};

// Update supplier
export const updateSupplier = async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!supplier) {
    return res.status(404).json({ error: 'Supplier not found' });
  }
  res.json(supplier);
};

// Delete supplier
export const deleteSupplier = async (req, res) => {
  const supplier = await Supplier.findByIdAndDelete(req.params.id);
  if (!supplier) {
    return res.status(404).json({ error: 'Supplier not found' });
  }
  res.json({ message: 'Supplier deleted successfully' });
};
