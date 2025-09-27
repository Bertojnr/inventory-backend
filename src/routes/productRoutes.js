import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

// All product routes require login
router.use(protect);

// View products → any logged-in user
router.get("/", getProducts);
router.get("/:id", getProductById);

// Manage products → MANAGER or ADMIN
router.post("/", roleMiddleware("MANAGER", "Admin"), createProduct);
router.put("/:id", roleMiddleware("MANAGER", "Admin"), updateProduct);

// Delete product → ADMIN only
router.delete("/:id", roleMiddleware("ADMIN"), deleteProduct);

export default router;
