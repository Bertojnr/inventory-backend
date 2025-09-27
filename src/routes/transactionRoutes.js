import { Router } from "express";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

// All transaction routes require login
router.use(protect);

// View transactions → any logged-in user
router.get("/", getTransactions);
router.get("/:id", getTransactionById);

// Create transaction (IN/OUT) → STAFF, MANAGER, or ADMIN
router.post("/", roleMiddleware("Staff", "MANAGER", "Admin"), createTransaction);

// Update transaction → MANAGER or ADMIN
router.put("/:id", roleMiddleware("MANAGER", "Admin"), updateTransaction);

// Delete transaction → ADMIN only
router.delete("/:id", roleMiddleware("Admin"), deleteTransaction);

export default router;
