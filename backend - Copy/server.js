import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";

// ============================
// App Config
// ============================
const app = express();
const port = process.env.PORT || 4000;

// ============================
// Connect to DB + Cloudinary
// ============================
connectDB();
connectCloudinary();

// ============================
// Middleware
// ============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================
// CORS Configuration
// ============================
const allowedOrigins = [
  "http://localhost:5173",  // User frontend
  "http://localhost:5174",  // Admin panel
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "aToken",   // Admin token
    "token",    // User token
  ],
  credentials: true,
}));

// ============================
// OPTIONS Preflight Fix
// ============================
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "aToken",
    "token",
  ],
  credentials: true,
}));

// ============================
// API Routes
// ============================
app.use("/api/user", userRouter);    // User login, register, bookings
app.use("/api/admin", adminRouter);  // Admin login, manage buses, routes, bookings

// ============================
// Test / Health Check
// ============================
app.get("/", (req, res) => res.send("Bus Booking API is working!"));
app.get("/api/health", (req, res) => res.json({ status: "OK", message: "Bus Booking API is running!" }));

// ============================
// Global Error Handler
// ============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ============================
// Start Server
// ============================
app.listen(port, () => {
  console.log(`🚀 Server running on PORT: ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
});
