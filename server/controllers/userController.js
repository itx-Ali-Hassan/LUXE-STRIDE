import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Wishlist from "../models/Wishlist.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, users, total: users.length });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, user });
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["customer", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role");
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.role = role;
  await user.save();
  res.json({ success: true, user });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }
  await user.deleteOne();
  res.json({ success: true, message: "User removed" });
});

// @desc    Admin dashboard statistics
// @route   GET /api/users/stats/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalAdmins, totalCustomers, totalProducts, orders] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ role: "customer" }),
    Product.countDocuments(),
    Order.find(),
  ]);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const recentOrders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalAdmins,
      totalCustomers,
      totalProducts,
      totalOrders,
      totalRevenue,
    },
    recentOrders,
    recentUsers,
  });
});

// ---- Wishlist ----

// @desc    Get logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }
  res.json({ success: true, wishlist });
});

// @desc    Toggle product in wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
  } else {
    const exists = wishlist.products.some((p) => p.toString() === productId);
    if (exists) {
      wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
    } else {
      wishlist.products.push(productId);
    }
    await wishlist.save();
  }

  const populated = await wishlist.populate("products");
  res.json({ success: true, wishlist: populated });
});
