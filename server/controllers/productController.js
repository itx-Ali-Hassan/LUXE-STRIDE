import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all products (search, filter, paginate)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice, page = 1, limit = 12, sort } = req.query;

  const query = {};
  if (keyword) query.$text = { $search: keyword };
  if (category && category !== "All") query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };
  if (sort === "name_asc") sortOption = { name: 1 };

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOption)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json({
    success: true,
    products,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, stock, sizes, brand } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("Product image is required");
  }

  const product = await Product.create({
    name,
    description,
    category,
    price,
    stock,
    brand,
    sizes: sizes ? JSON.parse(sizes) : undefined,
    image: { url: req.file.path, public_id: req.file.filename },
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { name, description, category, price, stock, sizes, brand } = req.body;

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.category = category ?? product.category;
  product.price = price ?? product.price;
  product.stock = stock ?? product.stock;
  product.brand = brand ?? product.brand;
  if (sizes) product.sizes = JSON.parse(sizes);

  if (req.file) {
    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id).catch(() => {});
    }
    product.image = { url: req.file.path, public_id: req.file.filename };
  }

  const updated = await product.save();
  res.json({ success: true, product: updated });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.image?.public_id) {
    await cloudinary.uploader.destroy(product.image.public_id).catch(() => {});
  }
  await product.deleteOne();

  res.json({ success: true, message: "Product removed" });
});
