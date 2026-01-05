import jwt from "jsonwebtoken";
import Bus from "../models/BusModel.js";
import {Route} from "../models/routeModel.js"; // FIXED import
import Booking from "../models/BookingModel.js";
import User from "../models/UserModel.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * Helper function to generate seats based on the specified bus type and prices.
 * @param {string} busType - The type of bus (e.g., 'semi sleeper', 'sleeper', 'seater').
 * @param {string | number} seaterPrice - Price for seater seats (passed as string from req.body).
 * @param {string | number} sleeperPrice - Price for sleeper seats (passed as string from req.body).
 * @returns {Array<object>} The generated seats array.
 */
const generateSeatsByType = (busType, seaterPrice, sleeperPrice) => {
  const seatsArray = [];
  const seaterP = Number(seaterPrice);
  const sleeperP = Number(sleeperPrice);

  // Columns for layout blocks
  const LOWER_DECK_COLS = ["A", "B", "C"]; // Lower deck: A | B C
  const UPPER_DECK_COLS = ["D", "E", "F"]; // Upper deck: D | E F

  switch (busType.toLowerCase().trim()) {

    /* ===================== SEATER ===================== */
    case "seater": {
      const ROWS = 10; // adjust as needed

      for (let row = 1; row <= ROWS; row++) {
        // Lower deck
        LOWER_DECK_COLS.forEach((col, index) => {
          seatsArray.push({
            seatNumber: `${row}${col}`,
            type: "seater",
            berth: "lower",
            price: seaterP,
            isWindow: col === "A" || col === "C",
            isBooked: false,
            deck: 1,
            layoutPosition: index, // optional, helps in rendering
          });
        });

        // Upper deck
        UPPER_DECK_COLS.forEach((col, index) => {
          seatsArray.push({
            seatNumber: `${row}${col}`,
            type: "seater",
            berth: "upper",
            price: seaterP,
            isWindow: col === "D" || col === "F",
            isBooked: false,
            deck: 2,
            layoutPosition: index, // optional
          });
        });
      }
      break;
    }

    /* ===================== SLEEPER ===================== */
    case "sleeper": {
      const ROWS = 7;

      // LOWER DECK
      for (let row = 1; row <= ROWS; row++) {
        LOWER_DECK_COLS.forEach((col, index) => {
          seatsArray.push({
            seatNumber: `${row}${col}L`,
            type: "sleeper",
            berth: "lower",
            price: sleeperP,
            isWindow: col === "A" || col === "C",
            isBooked: false,
            deck: 1,
            layoutPosition: index,
          });
        });
      }

      // UPPER DECK
      for (let row = 1; row <= ROWS; row++) {
        UPPER_DECK_COLS.forEach((col, index) => {
          seatsArray.push({
            seatNumber: `${row}${col}U`,
            type: "sleeper",
            berth: "upper",
            price: sleeperP,
            isWindow: col === "D" || col === "F",
            isBooked: false,
            deck: 2,
            layoutPosition: index,
          });
        });
      }
      break;
    }

    /* ===================== SEMI SLEEPER ===================== */
    case "semi-sleeper": {
      const SEATER_ROWS = 8;
      const SLEEPER_ROWS = 6;

      // LOWER DECK SEATERS
      for (let row = 1; row <= SEATER_ROWS; row++) {
        LOWER_DECK_COLS.forEach((col, index) => {
          seatsArray.push({
            seatNumber: `${row}${col}`,
            type: "seater",
            berth: "lower",
            price: seaterP,
            isWindow: col === "A" || col === "C",
            isBooked: false,
            deck: 1,
            layoutPosition: index,
          });
        });
      }
      

      // UPPER DECK SLEEPERS
      for (let row = SEATER_ROWS + 1; row <= SEATER_ROWS + SLEEPER_ROWS; row++) {
        UPPER_DECK_COLS.forEach((col, index) => {
          seatsArray.push({
            seatNumber: `${row}${col}U`,
            type: "sleeper",
            berth: "upper",
            price: sleeperP,
            isWindow: col === "D" || col === "F",
            isBooked: false,
            deck: 2,
            layoutPosition: index,
          });
        });
      }
      break;
    }

    /* ===================== DEFAULT ===================== */
    default: {
      const ROWS = 10;
      for (let row = 1; row <= ROWS; row++) {
        LOWER_DECK_COLS.forEach((col, index) => {
          seatsArray.push({
            seatNumber: `${row}${col}`,
            type: "seater",
            berth: "none",
            price: seaterP,
            isWindow: col === "A" || col === "C",
            isBooked: false,
            deck: 1,
            layoutPosition: index,
          });
        });
        UPPER_DECK_COLS.forEach((col, index) => {
          seatsArray.push({
            seatNumber: `${row}${col}`,
            type: "seater",
            berth: "none",
            price: seaterP,
            isWindow: col === "D" || col === "F",
            isBooked: false,
            deck: 2,
            layoutPosition: index,
          });
        });
      }
    }
  }

  return seatsArray;
};



// ------------------------ ADMIN LOGIN ------------------------
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d",
      });
      return res.json({ success: true, token });
    }
    res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------ DASHBOARD ------------------------
const adminDashboard = async (req, res) => {
  try {
    const totalBuses = await Bus.countDocuments();
    const totalRoutes = await Route.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();

    const latestBookings = await Booking.find()
      .populate("userId", "name email image")
      .populate({ path: "busId", populate: { path: "routeId" } })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      dashboard: { totalBuses, totalRoutes, totalBookings, totalUsers, latestBookings },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------ GET ALL BUSES ------------------------
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate("routeId");
    res.json({ success: true, buses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------ ADD BUS ------------------------
const addBus = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "Bus image is required." });

    const {
      busName,
      busType,
      routeId,
      amenities = "[]",
      seaterPrice,
      sleeperPrice,
      departureTime,
      arrivalTime,
      duration,
    } = req.body;

    if (!busName || !busType || !routeId || !seaterPrice || !sleeperPrice || !departureTime || !arrivalTime || !duration) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const imageUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: "buses" }, (err, result) =>
        err ? reject(err) : resolve(result)
      );
      uploadStream.end(req.file.buffer);
    });

    let amenitiesArray = [];
    try {
      amenitiesArray = JSON.parse(amenities);
      if (!Array.isArray(amenitiesArray)) amenitiesArray = [];
    } catch {
      amenitiesArray = [];
    }

    // =========================================================================
    // ------------------------ FIXED SEAT GENERATION LOGIC ----------------------
    // Calling the helper function to generate seats based on bus type
    // =========================================================================
    const seatsArray = generateSeatsByType(busType, seaterPrice, sleeperPrice);

    const newBus = new Bus({
      busName: busName.trim(),
      busType: busType.trim(),
      routeId,
      amenities: amenitiesArray,
      seats: seatsArray,
      image: imageUpload.secure_url,
      departureTime: departureTime.trim(),
      arrivalTime: arrivalTime.trim(),
      duration: duration.trim(),
    });

    await newBus.save();

    res.status(201).json({ success: true, message: "Bus added successfully", bus: newBus });
  } catch (err) {
    console.error("Add Bus Error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

// ------------------------ ROUTES ------------------------
const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json({ success: true, routes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const addRoute = async (req, res) => {
  try {
    const { source, destination, stops = [], distance, time } = req.body;
    if (!source || !destination)
      return res.status(400).json({ success: false, message: "Source and destination are required" });
    const newRoute = new Route({ source, destination, stops, distance, time });
    await newRoute.save();
    res.json({ success: true, message: "Route added successfully", route: newRoute });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------ BOOKINGS ------------------------
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email image")
      .populate({ path: "busId", populate: { path: "routeId" } });
    res.json({ success: true, bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------ CANCEL BOOKING ------------------------
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ success: false, message: "Booking ID required" });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    booking.cancelled = true;
    await booking.save();

    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------ EXPORT ------------------------
export {
  loginAdmin,
  adminDashboard,
  getAllBuses,
  addBus,
  getAllRoutes,
  addRoute,
  getAllBookings,
  cancelBooking, // added for admin context
};