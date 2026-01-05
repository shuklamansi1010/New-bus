// src/pages/BusDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import {
  FaBus,
  FaClock,
  FaMapMarkerAlt,
  FaChair,
  FaUser,
  FaRupeeSign,
  FaWheelchair,
  FaFemale,
  FaMale,
} from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const BusDetails = () => {
  const { busId } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const navigate = useNavigate();
  const { token, currencySymbol, showNotification } = useContext(AppContext);

  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [boardingPoint, setBoardingPoint] = useState("");
  const [droppingPoint, setDroppingPoint] = useState("");

  useEffect(() => {
    const fetchBus = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/bus/${busId}`);

        if (data.success) {
          setBus(data.bus);
          // Pre-fill points if available
          if (data.bus.boardingPoints?.length) setBoardingPoint(data.bus.boardingPoints[0]);
          if (data.bus.droppingPoints?.length) setDroppingPoint(data.bus.droppingPoints[0]);
        } else {
          showNotification("Bus not found", "error");
          navigate("/search");
        }
      } catch (error) {
        console.error("Fetch bus error:", error);
        showNotification("Failed to load bus details", "error");
        navigate("/search");
      } finally {
        setLoading(false);
      }
    };

    fetchBus();
  }, [busId, navigate, showNotification]);

  const toggleSeat = (seat) => {
    if (seat.isBooked) return;

    if (selectedSeats.includes(seat.seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.seatNumber));
      setPassengers(passengers.filter((p) => p.seat !== seat.seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seat.seatNumber]);
      setPassengers([...passengers, { seat: seat.seatNumber, name: "", age: "", gender: "Male" }]);
    }
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const calculateTotal = () => {
    if (!bus || !bus.seats) return 0;
    return selectedSeats.reduce((total, seatNum) => {
      const seat = bus.seats.find((s) => s.seatNumber === seatNum);
      return total + (seat?.price || 0);
    }, 0);
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      showNotification("Please select at least one seat", "warning");
      return;
    }

    if (passengers.some((p) => !p.name || !p.age)) {
      showNotification("Please fill all passenger details", "warning");
      return;
    }

    if (!boardingPoint || !droppingPoint) {
      showNotification("Please select boarding and dropping points", "warning");
      return;
    }

    // Navigate to payment or review
    navigate("/payment", {
      state: {
        bus,
        selectedSeats,
        passengers,
        boardingPoint,
        droppingPoint,
        journeyDate: date,
        totalFare: calculateTotal(),
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
          <p className="mt-6 text-xl text-gray-600">Loading bus details...</p>
        </div>
      </div>
    );
  }

  if (!bus) return null;

  const isSleeper = bus.busType.toLowerCase().includes("sleeper");
  const lowerSeats = bus.seats?.filter((s) => s.berth === "lower" || !isSleeper) || [];
  const upperSeats = bus.seats?.filter((s) => s.berth === "upper") || [];

  const renderSeatMap = (seats, title) => (
    <div className="mb-8">
      {title && <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>}
      <div className="grid grid-cols-5 gap-3 bg-gray-100 p-6 rounded-xl">
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.seatNumber);
          const isBooked = seat.isBooked;

          return (
            <div
              key={seat.seatNumber}
              onClick={() => toggleSeat(seat)}
              className={`w-16 h-16 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer transition-all ${
                isBooked
                  ? "bg-red-200 text-red-700 cursor-not-allowed"
                  : isSelected
                  ? "bg-green-500 text-white shadow-lg scale-110"
                  : "bg-white hover:bg-green-100 shadow-md border-2 border-gray-300"
              }`}
            >
              {seat.seatNumber}
              {seat.type === "ladies" && <FaFemale className="text-pink-600 text-xs absolute -top-1 -right-1" />}
              {seat.type === "wheelchair" && <FaWheelchair className="text-blue-600 text-xs" />}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Bus Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{bus.busName}</h1>
              <p className="text-xl text-gray-600">{bus.busType}</p>
              <div className="flex items-center gap-6 mt-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-600" />
                  <span>
                    {bus.routeId?.source} → {bus.routeId?.destination}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-green-600" />
                  <span>
                    {bus.departureTime} → {bus.arrivalTime}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Journey Date</p>
              <p className="text-2xl font-bold text-green-600">
                {new Date(date).toDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Seats</h2>

              {renderSeatMap(lowerSeats, isSleeper ? "Lower Deck" : "Seating Layout")}
              {isSleeper && renderSeatMap(upperSeats, "Upper Deck")}

              {/* Legend */}
              <div className="flex flex-wrap gap-6 mt-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded text-white flex items-center justify-center">✓</div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-200 rounded"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded relative">
                    <FaFemale className="text-pink-600 text-xs absolute -top-1 -right-1" />
                  </div>
                  <span>Ladies</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary & Passenger Form */}
          <div className="space-y-8">
            {/* Points Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Boarding & Dropping</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Boarding Point</label>
                  <select
                    value={boardingPoint}
                    onChange={(e) => setBoardingPoint(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select boarding point</option>
                    {bus.boardingPoints?.map((point) => (
                      <option key={point} value={point}>
                        {point}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dropping Point</label>
                  <select
                    value={droppingPoint}
                    onChange={(e) => setDroppingPoint(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select dropping point</option>
                    {bus.droppingPoints?.map((point) => (
                      <option key={point} value={point}>
                        {point}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            {selectedSeats.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Passenger Details ({selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""})
                </h3>
                <div className="space-y-4">
                  {passengers.map((passenger, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FaChair className="text-green-600" />
                        <span className="font-semibold">Seat {passenger.seat}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Name"
                          value={passenger.name}
                          onChange={(e) => updatePassenger(index, "name", e.target.value)}
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Age"
                          min="5"
                          max="100"
                          value={passenger.age}
                          onChange={(e) => updatePassenger(index, "age", e.target.value)}
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <select
                          value={passenger.gender}
                          onChange={(e) => updatePassenger(index, "gender", e.target.value)}
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fare Summary */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4">Fare Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Selected Seats</span>
                  <span className="font-bold">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between text-2xl font-black">
                  <span>Total Fare</span>
                  <span>{currencySymbol}{calculateTotal()}</span>
                </div>
              </div>
              <button
                onClick={handleProceed}
                disabled={selectedSeats.length === 0}
                className="w-full mt-6 py-4 bg-white text-green-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetails;