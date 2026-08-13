import express from "express";
import {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getDashboardStats,
  getWishlist,
  toggleWishlist,
} from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Wishlist (any authenticated user)
router.get("/wishlist/me", protect, getWishlist);
router.post("/wishlist/:productId", protect, toggleWishlist);

// Admin dashboard
router.get("/stats/dashboard", protect, authorizeRoles("admin"), getDashboardStats);

// User management (admin only)
router.get("/", protect, authorizeRoles("admin"), getUsers);
router.get("/:id", protect, authorizeRoles("admin"), getUserById);
router.put("/:id/role", protect, authorizeRoles("admin"), updateUserRole);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
