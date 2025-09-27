import { Router } from "express";
import {
  getInventoryReport,
  getSupplierReport,
  getTransactionReport,
  getLowStockReport,
  getSalesReport,
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

// All report routes require login
router.use(protect);

// Reports → MANAGER or ADMIN only
router.get("/inventory", roleMiddleware("MANAGER", "Admin"), getInventoryReport);
router.get("/suppliers", roleMiddleware("MANAGER", "Admin"), getSupplierReport);
router.get("/transactions", roleMiddleware("MANAGER", "Admin"), getTransactionReport);

router.get("/low-stock", roleMiddleware("MANAGER", "Admin"), getLowStockReport);
router.get("/sales", roleMiddleware("MANAGER", "Admin"), getSalesReport);

export default router;
