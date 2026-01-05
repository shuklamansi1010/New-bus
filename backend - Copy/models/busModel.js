import mongoose from "mongoose";

// Seat sub-schema
const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true, // e.g., "1A", "2BU"
  },
  type: {
    type: String,
    enum: ["seater", "sleeper"],
    required: true,
    lowercase: true,
  },
  berth: {
    type: String,
    enum: ["lower", "upper", "none"],
    default: "none",
    lowercase: true,
  },
  isWindow: { type: Boolean, default: false },
  isAisle: { type: Boolean, default: false },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
});

// Main Bus schema
const busSchema = new mongoose.Schema(
  {
    busName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    busType: {
      type: String,
      required: true,
      enum: ["Sleeper", "Semi-Sleeper", "Seater"],
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    seats: {
      type: [seatSchema],
      default: [],
    },
    departureTime: {
      type: String, // e.g., "22:00"
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    duration: {
      type: String, // e.g., "8h 30m"
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
busSchema.index({ routeId: 1, departureTime: 1 });
busSchema.index({ "seats.isBooked": 1 });

// Virtuals
busSchema.virtual("availableSeatsCount").get(function () {
  return this.seats.filter((seat) => !seat.isBooked).length;
});

busSchema.virtual("availableSeats").get(function () {
  return this.seats.filter((seat) => !seat.isBooked);
});

const Bus = mongoose.models.Bus || mongoose.model("Bus", busSchema);
export default Bus;
