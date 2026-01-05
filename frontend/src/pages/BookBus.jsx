// src/pages/BookBus.jsx
import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import axios from "axios";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Clock,
  Bus,
  Ticket,
  IndianRupee,
  Armchair,
  QrCode,
  X,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import SeatLayout, { MAX_SEATS as SEAT_LAYOUT_MAX_SEATS } from "../components/SeatLayout";

// QR codes
import QR_529 from "../assets/529_QR.jpg";
import QR_600 from "../assets/600_QR.jpg";
import QR_788 from "../assets/788_QR.jpg";
import QR_1052 from "../assets/1052_QR.jpg";
import QR_1149 from "../assets/1149_QR.jpg";
import QR_1258 from "../assets/1258_QR.jpg";
import QR_1350 from "../assets/1350_QR.jpg";
import QR_1400 from "../assets/1400_QR.jpg";
import QR_1740 from "../assets/1740_QR.jpg";
import QR_1900 from "../assets/1900_QR.jpg";

// Google Form URL
const CONFIRMATION_FORM_URL = "https://forms.gle/kYzvbBCCYJDFyvBy9";

const BookBus = () => {
  const { busId } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const navigate = useNavigate();
  const { backendUrl, token, showNotification, getBusDetails } = useContext(AppContext);

  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [boardingPoint, setBoardingPoint] = useState("");
  const [dropPoint, setDropPoint] = useState("");
  const [passengers, setPassengers] = useState([]);
  const [step, setStep] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // Fetch bus details
  useEffect(() => {
    const fetchBus = async () => {
      if (!busId || !date) return navigate("/search");
      setLoading(true);
      try {
        const busData = await getBusDetails(busId, date);
        if (!busData) return navigate("/search");

        const route = busData.routeId;
        const source = route.source || "Source";
        const destination = route.destination || "Destination";
        const stops = Array.isArray(route.stops)
          ? route.stops.map(s => (typeof s === "string" ? s : s.name))
          : [];

        const uniqueBoarding = [...new Set([source, ...stops])];
        const uniqueDrop = [...new Set([...stops, destination])];

        setBus({
          ...busData,
          _source: source,
          _destination: destination,
          _boardingPoints: uniqueBoarding,
          _dropPoints: uniqueDrop,
        });

        setBoardingPoint(uniqueBoarding[0] || "");
        setDropPoint(uniqueDrop[uniqueDrop.length - 1] || "");
      } catch (err) {
        console.error(err);
        showNotification("Failed to load bus details", "error");
        navigate("/search");
      } finally {
        setLoading(false);
      }
    };
    fetchBus();
  }, [busId, date, getBusDetails, navigate, showNotification]);

  const handleSeatSelect = useCallback((seat) => {
    if (seat.isBooked) return;
    setSelectedSeats((prev) =>
      prev.includes(seat.seatNumber)
        ? prev.filter((s) => s !== seat.seatNumber)
        : prev.length < SEAT_LAYOUT_MAX_SEATS
        ? [...prev, seat.seatNumber]
        : prev
    );
  }, []);

  const totalPrice = selectedSeats.reduce(
    (sum, seatNum) =>
      sum + (bus?.seats?.find((s) => s.seatNumber === seatNum)?.price || 0),
    0
  );

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const isPassengerDetailsValid =
    passengers.length === selectedSeats.length &&
    passengers.every((p) => p.name.trim() && p.age && p.gender);

  // Create booking
  const createBooking = async () => {
    if (!token) {
      showNotification("Please login to continue", "warning");
      navigate("/login");
      return false;
    }
    if (selectedSeats.length === 0) {
      showNotification("Please select at least one seat", "warning");
      return false;
    }
    if (!isPassengerDetailsValid) {
      showNotification("Please fill all passenger details", "warning");
      return false;
    }

    try {
      const seats = selectedSeats.map((seatNum) => {
        const seat = bus.seats.find((s) => s.seatNumber === seatNum);
        return {
          seatNumber: seat.seatNumber,
          type: seat.type || "seater",
          price: seat.price,
        };
      });

      const payload = {
        busId,
        seats,
        totalAmount: totalPrice,
        journeyDate: date,
        boardingInfo: [
          { point: boardingPoint, time: bus.departureTime },
          { point: dropPoint, time: bus.arrivalTime },
        ],
        passengers,
      };

      const response = await axios.post(`${backendUrl}/api/user/book`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setBookingId(response.data.booking._id);
        return true;
      }
      showNotification(response.data.message || "Booking failed", "error");
      return false;
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || "Booking error", "error");
      return false;
    }
  };

  const handleBookingTrigger = async () => {
    if (await createBooking()) {
      setShowPaymentModal(true);
    }
  };

  const completeBooking = () => {
    setShowPaymentModal(false);
    setStep(4);
  };

  const handleFormConfirmation = () => {
    setIsConfirming(true);
    setFormSubmitted(true);
    showNotification("Payment confirmed! Redirecting to your bookings...", "success");

    // Seamless redirect after confirmation
    setTimeout(() => {
      navigate("/my-bookings");
    }, 1500);
  };

  const getStaticQR = () => {
    const qrMap = {
      529: QR_529,
      600: QR_600,
      788: QR_788,
      1052: QR_1052,
      1149: QR_1149,
      1258: QR_1258,
      1350: QR_1350,
      1400: QR_1400,
      1740: QR_1740,
      1900: QR_1900,
    };
    return qrMap[totalPrice] || null;
  };

  if (loading || !bus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading bus details...</p>
        </div>
      </div>
    );
  }

  const steps = [
    "Select Seats",
    "Boarding & Drop",
    "Passenger Details",
    "Payment",
    "Confirmation",
  ];

  return (
    <div ref={scrollRef} className="min-h-screen bg-slate-50 py-8 px-4">
      {/* Progress Stepper */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step > i + 1
                    ? "bg-green-600 text-white"
                    : step === i + 1
                    ? "bg-emerald-600 text-white scale-110 shadow-lg"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step > i + 1 ? <CheckCircle size={20} /> : i + 1}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:block text-gray-600">
                {label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`w-full h-1 mx-4 transition-all ${
                    step > i + 1 ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <QrCode size={28} /> Scan & Pay
                </h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="hover:bg-white/20 p-2 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-8 text-center space-y-6">
              <div>
                <p className="text-gray-500 uppercase tracking-wider text-sm font-semibold">
                  Amount to Pay
                </p>
                <h2 className="text-5xl font-extrabold text-gray-900 flex items-center justify-center gap-2 mt-2">
                  <IndianRupee size={40} /> {totalPrice.toLocaleString()}
                </h2>
              </div>

              <div className="bg-gray-100 p-6 rounded-3xl border-4 border-dashed border-gray-300">
                {getStaticQR() ? (
                  <img
                    src={getStaticQR()}
                    alt="Payment QR"
                    className="w-64 h-64 mx-auto object-contain"
                  />
                ) : (
                  <p className="text-gray-500 text-lg">QR Code Not Available</p>
                )}
              </div>

              <button
                onClick={completeBooking}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-2xl shadow-xl transition transform hover:scale-105"
              >
                I've Paid ₹{totalPrice.toLocaleString()} → Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Seat Selection */}
          {step === 1 && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Armchair size={28} /> Select Your Seats
                </h2>
              </div>
              <div className="p-6">
                <SeatLayout
                  bus={bus}
                  seatsData={bus.seats}
                  selectedSeats={selectedSeats}
                  onSeatSelect={handleSeatSelect}
                />
              </div>
              <div className="p-6 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-lg font-medium">
                  {selectedSeats.length > 0
                    ? `${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""} selected: ${selectedSeats.join(", ")}`
                    : "No seats selected"}
                </p>
                <button
                  onClick={() => setStep(2)}
                  disabled={selectedSeats.length === 0}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold rounded-2xl flex items-center gap-2 transition"
                >
                  Next <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Boarding & Drop */}
          {step === 2 && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-8">
              <h2 className="text-2xl font-bold text-center">Choose Boarding & Drop Points</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Boarding Point
                  </label>
                  <select
                    value={boardingPoint}
                    onChange={(e) => setBoardingPoint(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:outline-none transition"
                  >
                    {bus._boardingPoints.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Drop Point
                  </label>
                  <select
                    value={dropPoint}
                    onChange={(e) => setDropPoint(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:outline-none transition"
                  >
                    {bus._dropPoints.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center gap-2"
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  onClick={() => {
                    setPassengers(
                      selectedSeats.map((s) => ({
                        seatNumber: s,
                        name: "",
                        age: "",
                        gender: "Male",
                      }))
                    );
                    setStep(3);
                  }}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Passenger Details */}
          {step === 3 && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">
              <h2 className="text-2xl font-bold text-center mb-8">Passenger Details</h2>
              <div className="space-y-6">
                {passengers.map((p, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-6 bg-emerald-50 rounded-2xl border border-emerald-200"
                  >
                    <div className="font-semibold text-emerald-800">
                      Seat {p.seatNumber}
                    </div>
                    <input
                      placeholder="Full Name"
                      value={p.name}
                      onChange={(e) => handlePassengerChange(i, "name", e.target.value)}
                      className="p-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={p.age}
                      onChange={(e) => handlePassengerChange(i, "age", e.target.value)}
                      className="p-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none"
                    />
                    <select
                      value={p.gender}
                      onChange={(e) => handlePassengerChange(i, "gender", e.target.value)}
                      className="p-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center gap-2"
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  onClick={handleBookingTrigger}
                  disabled={!isPassengerDetailsValid}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg transition"
                >
                  Proceed to Payment → ₹{totalPrice.toLocaleString()}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Payment Confirmation Form */}
          {step === 4 && !formSubmitted && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center space-y-8">
              <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Payment Completed Successfully!
                </h2>
                <p className="text-lg text-gray-600">
                  Please fill this quick form to confirm your payment.
                </p>
              </div>
              <a
                href={CONFIRMATION_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg transition transform hover:scale-105"
              >
                Open Confirmation Form
              </a>
              <div className="pt-6">
                <button
                  onClick={handleFormConfirmation}
                  disabled={isConfirming}
                  className="px-12 py-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white text-xl font-bold rounded-2xl shadow-xl transition transform hover:scale-105 flex items-center gap-3 mx-auto"
                >
                  {isConfirming ? (
                    <>Processing...</>
                  ) : (
                    <>
                      I Have Filled the Form <CheckCircle size={24} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Final Success (brief flash before redirect) */}
          {formSubmitted && !isConfirming && (
            <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-3xl p-12 text-center shadow-2xl">
              <Ticket size={80} className="mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">Booking Confirmed!</h2>
              <p className="text-xl mb-2">Booking ID: {bookingId}</p>
              <p className="text-lg opacity-90">Redirecting to your bookings...</p>
            </div>
          )}
        </div>

        {/* Fare Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border-t-8 border-emerald-600 sticky top-24 p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Fare Summary</h3>
            <div className="space-y-3">
              {selectedSeats.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No seats selected</p>
              ) : (
                selectedSeats.map((s) => {
                  const seat = bus.seats.find((st) => st.seatNumber === s);
                  return (
                    <div key={s} className="flex justify-between text-lg">
                      <span className="font-medium">Seat {s}</span>
                      <span className="font-bold">₹{seat?.price}</span>
                    </div>
                  );
                })
              )}
              <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-6">
                <div className="flex justify-between text-2xl font-extrabold text-emerald-600">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookBus;