import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "LuxeStride API" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

if (process.env.NODE_ENV === "production") {
    const clientPath = path.join(__dirname, "../client/dist");

    app.use(express.static(clientPath));

    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(clientPath, "index.html"));
    });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`LuxeStride API running on port ${PORT}`));