import Product from "../models/product.js";
import Supplier from "../models/supplier.js";
import Transaction from "../models/transaction.js";

/**
 * Inventory Report
 * - Total number of products
 * - Total stock (sum of all quantities)
 * - Total inventory value (sum of price * quantity)
 */
export const getInventoryReport = async (req, res) => {
  try {
    const products = await Product.find();

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalValue = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    res.json({ totalProducts, totalStock, totalValue });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inventory report" });
  }
};

/**
 * Supplier Report
 * - Total suppliers
 * - Top 5 suppliers by number of products
 */
export const getSupplierReport = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$supplierId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplier",
        },
      },
      { $unwind: "$supplier" },
      {
        $project: {
          _id: 0,
          supplier: "$supplier.name",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const totalSuppliers = await Supplier.countDocuments();

    res.json({ totalSuppliers, topSuppliers: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch supplier report" });
  }
};


/**
 * Transaction Report
 * - Total transactions
 * - IN vs OUT transaction counts
 * - Recent 5 transactions
 */
export const getTransactionReport = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });

    const totalTransactions = transactions.length;
    const inCount = transactions.filter((t) => t.type === "IN").length;
    const outCount = transactions.filter((t) => t.type === "OUT").length;
    const recentTransactions = transactions.slice(0, 5);

    res.json({
      totalTransactions,
      inCount,
      outCount,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transaction report" });
  }
};

export const getLowStockReport = async (req, res) => {
  try {
    const lowStock = await Product.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] },
    });

    res.json({ count: lowStock.length, lowStock });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch low stock report" });
  }
};

/**
 * Sales Report
 * - Total OUT transactions within a date range
 * - Grouped by product
 */
export const getSalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { type: "OUT" };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const sales = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: "$quantity" },
          totalSales: { $sum: { $multiply: ["$quantity", 1] } }, // price join optional
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productId: "$_id",
          name: "$product.name",
          totalQuantity: 1,
          // optional: multiply by product price for total revenue
          totalRevenue: { $multiply: ["$totalQuantity", "$product.price"] },
        },
      },
    ]);

    res.json({ sales });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales report" });
  }
};
