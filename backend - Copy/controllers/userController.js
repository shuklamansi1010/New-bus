import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/UserModel.js"; // This is the imported model
import Booking from "../models/BookingModel.js";
import Bus from "../models/BusModel.js";
import { Route } from "../models/routeModel.js";
import { v2 as cloudinary } from "cloudinary";


// ---------------------- REGISTER USER ----------------------
export const registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        name = name ? name.trim() : "";
        email = email ? email.trim() : "";

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: "User already exists" });

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        // ✅ Let Mongoose hash the password automatically
        const newUser = new User({ name, email, password });
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// ---------------------- LOGIN USER ----------------------
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // 2️⃣ Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // 3️⃣ Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


/* ================= USER ================= */
// Get user profile
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, userData: req.user });
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, dob } = req.body;

    if (!name || !phone || !gender || !dob) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (req.file) req.user.image = req.file.path; // if using multer/cloudinary
    req.user.name = name;
    req.user.phone = phone;
    req.user.gender = gender;
    req.user.dob = dob;

    await req.user.save();

    res.json({ success: true, message: 'Profile updated successfully', userData: req.user });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


/* ================= ROUTES ================= */

export const getAllRoutesForUser = async (req, res) => {
  try {
    const routes = await Route.find({}).sort({ source: 1 });
    res.json({ success: true, routes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= BUSES ================= */

// SEARCH / LIST BUSES
export const getBusesByRoute = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date)
      return res.status(400).json({ success: false, message: "Missing search parameters" });

    // Find all routes matching from -> to
    const routes = await Route.find({ source: from, destination: to }).lean();

    if (!routes.length) return res.json({ success: true, buses: [] });

    const routeIds = routes.map(r => r._id);

    const buses = await Bus.find({ routeId: { $in: routeIds }, isActive: true })
      .populate("routeId")
      .lean();

    res.json({ success: true, buses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// BUS DETAILS
export const getBusDetails = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.busId).populate("routeId");

    if (!bus)
      return res.status(404).json({ success: false, message: "Bus not found" });

    res.json({ success: true, bus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= BOOKINGS ================= */


// ---------------------- BOOK BUS ----------------------
// controllers/userController.js or wherever it is
export const bookBus = async (req, res) => {
  try {
    const {
      busId,
      seats,           // array of { seatNumber, type, price }
      totalAmount,
      journeyDate,
      boardingInfo     // array of { point, time }
    } = req.body;

    const userId = req.user.id; // from auth middleware

    // Basic validation
    if (!busId || !seats?.length || !totalAmount || !journeyDate || !boardingInfo?.length) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking details"
      });
    }

    // Create the booking
    const booking = await Booking.create({
      userId,
      busId,
      seats,
      totalAmount,
      journeyDate: new Date(journeyDate), // ensure it's a Date
      boardingInfo,
      payment: false,
      isCompleted: false
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking
    });

  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create booking"
    });
  }
};

// ---------------------- LIST USER BOOKINGS ----------------------
export const listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate({ path: "busId", populate: { path: "routeId" } })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("List Bookings Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------------- CANCEL BOOKING ----------------------
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking || booking.userId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const bus = await Bus.findById(booking.busId);
    if (bus) {
      bus.seats.forEach((seat) => {
        if (booking.seats.some((b) => b.seatNumber === seat.seatNumber)) {
          seat.isBooked = false;
          seat.bookedBy = null;
        }
      });
      await bus.save();
    }

    await booking.deleteOne();
    res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    console.error("Cancel Booking Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
