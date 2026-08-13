// Run with: npm run seed
// Seeds an admin account and a handful of demo shoe products.
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

dotenv.config();
await connectDB();

const run = async () => {
  const adminEmail = "admin@luxestride.com";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "Store Admin",
      email: adminEmail,
      password: "Admin@12345",
      role: "admin",
    });
    console.log("Created admin:", adminEmail, "/ password: Admin@12345");
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    console.log("No products found. Add products via the Admin Dashboard (image upload requires Cloudinary).");
  }

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
