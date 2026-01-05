import mongoose from "mongoose";

const bookedSeatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  type: { type: String, enum: ["sleeper", "seater"], required: true },
  price: { type: Number, required: true },
});

const boardingPointSchema = new mongoose.Schema({
  point: { type: String, required: true },
  time: { type: String, required: true },
});

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    seats: [bookedSeatSchema],
    totalAmount: { type: Number, required: true },
    journeyDate: { type: Date, required: true },
    boardingInfo: [boardingPointSchema], // store boarding points and times
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ← THIS IS THE KEY FIX
export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);