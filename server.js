require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const intakeRoutes = require("./routes/intakeLogs");
const userRoutes = require("./routes/users");

const app = express();

// Middleware (CORS & JSON parsing must come BEFORE routes)
app.use(cors({ origin: "*" }));
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/water-tracker")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/intake", intakeRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});