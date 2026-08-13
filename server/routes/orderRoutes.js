import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, authorizeRoles("admin"), getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, authorizeRoles("admin"), updateOrderStatus);

export default router;
