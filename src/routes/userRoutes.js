import { Router } from "express";
import { getUsers, deleteUser } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// All routes here require authentication
router.use(protect);

// Only Admin can access these
router.get("/", adminOnly, getUsers);
router.delete("/:id", adminOnly, deleteUser);

export default router;
