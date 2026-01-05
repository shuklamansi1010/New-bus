// models/routeModel.js
import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: [true, "Source city is required"],
      trim: true,
      uppercase: true,
    },
    destination: {
      type: String,
      required: [true, "Destination city is required"],
      trim: true,
      uppercase: true,
    },
    stops: {
      type: [String],
      default: [],
    },
    distance: {
      type: Number, // in km
    },
    duration: {
      type: String, // e.g., "12h 30m"
    },
  },
  { timestamps: true }
);

// Prevent duplicate routes
routeSchema.index({ source: 1, destination: 1 }, { unique: true });

export const Route = mongoose.model("Route", routeSchema);