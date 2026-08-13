import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
export const placeOrder = asyncHandler(async (req, res) => {
  const { items, shippingInfo } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  const required = ["fullName", "email", "phone", "address", "city"];
  for (const field of required) {
    if (!shippingInfo?.[field]) {
      res.status(400);
      throw new Error(`Shipping field '${field}' is required`);
    }
  }

  // Re-validate stock & compute authoritative totals from DB, never trust client prices
  let totalAmount = 0;
  let itemsCount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.name || item.product}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    totalAmount += product.price * item.quantity;
    itemsCount += item.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image.url,
      price: product.price,
      quantity: item.quantity,
      size: item.size,
    });

    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingInfo,
    itemsCount,
    totalAmount,
  });

  res.status(201).json({ success: true, order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Get single order (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }
  res.json({ success: true, order });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.status = status;
  const updated = await order.save();
  res.json({ success: true, order: updated });
});
