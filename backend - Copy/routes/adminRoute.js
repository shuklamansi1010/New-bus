import express from "express";
import { addBus, getAllBuses, loginAdmin, addRoute, getAllRoutes, getAllBookings, adminDashboard } from "../controllers/adminController.js";
import authAdmin from "../middleware/authAdmin.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Admin login
router.post("/login", loginAdmin);

// Auth middleware
router.use(authAdmin);

// Dashboard
router.get("/dashboard", adminDashboard);

// Buses
router.get("/buses", getAllBuses);
router.post("/add-bus", upload.single("image"), addBus);

// Routes
router.get("/routes", getAllRoutes);
router.post("/add-route", addRoute);

// Bookings
router.get("/bookings", getAllBookings);

export default router;
