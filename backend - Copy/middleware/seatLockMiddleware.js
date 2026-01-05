// middleware/seatLockMiddleware.js
import Schedule from "../models/scheduleModel.js";

export const lockSeatsMiddleware = async (req, res, next) => {
  try {
    const { scheduleId, seats } = req.body;

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ success: false, message: "Schedule not found" });

    const unavailableSeats = seats.filter(seat => !schedule.seatsAvailable.includes(seat));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ success: false, message: `Seats already booked: ${unavailableSeats.join(", ")}` });
    }

    // Atomic update to lock seats
    await Schedule.findByIdAndUpdate(scheduleId, {
      $pull: { seatsAvailable: { $in: seats } }
    });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Seat locking failed" });
  }
};
