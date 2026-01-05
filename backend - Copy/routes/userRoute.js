import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookBus,
  cancelBooking,
  listBookings,
  getAllRoutesForUser,
  getBusesByRoute,
  getBusDetails,
} from "../controllers/userController.js";

import authUser from "../middleware/authUser.js";

const router = express.Router();

/* ================= AUTH ================= */
// User registration
router.post("/register", registerUser);
// User login
router.post("/login", loginUser);

/* ================= PROFILE ================= */
// Get user profile (JWT required)
router.get("/profile", authUser, getProfile);
// Update profile (JWT required)
router.put("/profile", authUser, updateProfile);

/* ================= ROUTES ================= */
// Fetch all routes for search/home
router.get("/routes", getAllRoutesForUser);

/* ================= BUSES ================= */
// Search buses by route, date
router.get("/buses", getBusesByRoute);
// Single bus details by ID
router.get("/bus/:busId", getBusDetails);

/* ================= BOOKINGS ================= */
// Booking endpoints
router.post("/book", authUser, bookBus);
router.get("/bookings", authUser, listBookings);
router.delete("/booking/:bookingId", authUser, cancelBooking);

export default router;
