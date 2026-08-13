import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },
    description: { type: String, required: [true, "Description is required"] },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Sneakers", "Running", "Formal", "Boots", "Sandals", "Sports"],
    },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    stock: { type: Number, required: [true, "Stock quantity is required"], min: 0, default: 0 },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    brand: { type: String, default: "LuxeStride" },
    sizes: { type: [Number], default: [7, 8, 9, 10, 11] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", category: "text" });

export default mongoose.model("Product", productSchema);
