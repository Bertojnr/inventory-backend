import { Router } from "express";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

// All supplier routes require login
router.use(protect);

// View suppliers → any logged-in user
router.get("/", getSuppliers);
router.get("/:id", getSupplierById);

// Manage suppliers → MANAGER or ADMIN
router.post("/", roleMiddleware("MANAGER", "Admin"), createSupplier);
router.put("/:id", roleMiddleware("MANAGER", "Admin"), updateSupplier);

// Delete supplier → ADMIN only
router.delete("/:id", roleMiddleware("Admin"), deleteSupplier);

export default router;
