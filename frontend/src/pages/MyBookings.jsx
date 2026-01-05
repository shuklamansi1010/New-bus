// src/pages/MyBookings.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

// React Icons
import {
  FaTicketAlt,
  FaBus,
  FaRoute,
  FaCalendarAlt,
  FaClock,
  FaChair,
  FaRupeeSign,
  FaCreditCard,
  FaTimesCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaQrcode,
  FaTimes,
} from "react-icons/fa";

// QR images
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

const CONFIRMATION_FORM_URL = "https://forms.gle/kYzvbBCCYJDFyvBy9";

const MyBookings = () => {
  const navigate = useNavigate();
  const { backendUrl, token, currencySymbol, showNotification } = useContext(AppContext);
  const scrollRef = useRef(null);

  const [bookings, setBookings] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // ------------------- FETCH USER BOOKINGS -------------------
  const getUserBookings = async () => {
    if (!token) return navigate("/login");
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings.reverse());
      } else {
        showNotification(data.message || "Failed to load bookings", "error");
        setBookings([]);
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || "Failed to fetch bookings", "error");
      setBookings([]);
    }
  };

  // ------------------- CANCEL BOOKING -------------------
  const cancelBooking = async (bookingId) => {
    if (!bookingId) return;
    try {
      const { data } = await axios.delete(`${backendUrl}/api/user/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        showNotification(data.message || "Booking cancelled", "success");
        getUserBookings();
      } else {
        showNotification(data.message || "Cancellation failed", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || "Failed to cancel booking", "error");
    }
  };

  // ------------------- STATUS DISPLAY -------------------
  const getStatusDisplay = (booking) => {
    if (booking.cancelled) return { label: "Cancelled", icon: <FaTimesCircle />, class: "bg-red-100 text-red-800" };
    if (booking.isCompleted) return { label: "Completed", icon: <FaCheckCircle />, class: "bg-green-100 text-green-800" };
    if (booking.payment) return { label: "Paid", icon: <FaCreditCard />, class: "bg-blue-100 text-blue-800" };
    return { label: "Pending Payment", icon: <FaExclamationTriangle />, class: "bg-yellow-100 text-yellow-800" };
  };

  // ------------------- FORMAT DATE/TIME -------------------
  const formatDate = (dateStr) => {
    if (!dateStr) return "Date not set";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };
  const formatTime = (timeStr) => {
    if (!timeStr) return "?";
    const d = new Date(`1970-01-01T${timeStr}`);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => { if (token) getUserBookings(); }, [token]);

  // ------------------- QR Helper -------------------
  const getQR = (amount) => {
    const map = {
      529: QR_529, 600: QR_600, 788: QR_788, 1052: QR_1052,
      1149: QR_1149, 1258: QR_1258, 1350: QR_1350, 1400: QR_1400,
      1740: QR_1740, 1900: QR_1900,
    };
    return map[amount] || null;
  };

  const openQRModal = (booking) => {
    setSelectedBooking(booking);
    setShowQRModal(true);
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormConfirmation = () => {
    setFormSubmitted(true);
    setShowQRModal(false);
    showNotification("Payment confirmed! Thank you.", "success");
  };

  return (
    <div ref={scrollRef} className="max-w-6xl mx-auto px-4 py-8">

      {/* QR PAYMENT MODAL */}
      {showQRModal && selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-green-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2"><FaQrcode /> Scan to Pay</h3>
              <button onClick={() => setShowQRModal(false)} className="text-white/80 hover:text-white"><FaTimes size={24} /></button>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Amount to Pay</p>
              <h2 className="text-4xl font-black text-gray-900 flex items-center justify-center gap-1">
                <FaRupeeSign /> {selectedBooking.totalAmount || 0}
              </h2>
              <div className="bg-gray-50 p-4 rounded-3xl border-2 border-dashed border-gray-200 inline-block my-6">
                {getQR(selectedBooking.totalAmount) ? (
                  <img src={getQR(selectedBooking.totalAmount)} alt="QR" className="w-64 h-64 object-contain mx-auto" />
                ) : <p className="text-gray-400">QR Not Available</p>}
              </div>
              <a
                href={CONFIRMATION_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-red-600 text-white rounded-xl inline-block mb-4"
              >
                Open Confirmation Form
              </a>
              <button
                onClick={handleFormConfirmation}
                disabled={formSubmitted}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl transition-all"
              >
                {formSubmitted ? "Payment Pending..." : "I Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <FaTicketAlt className="w-10 h-10 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-800">My Bookings 🎟️</h1>
      </div>

      {/* BOOKINGS LIST */}
      {(!bookings || bookings.length === 0) ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <FaBus className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <p className="text-xl text-gray-500">You haven't booked any bus tickets yet.</p>
          <button
            onClick={() => navigate("/search")}
            className="mt-6 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-lg transition"
          >
            Search Buses Now
          </button>
        </div>
      ) : (
        bookings.map((booking) => {
          const bus = booking.busId || {};
          const route = bus.routeId || {};
          const status = getStatusDisplay(booking);

          return (
            <div key={booking._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Bus Info */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-6 text-center">
                    <FaBus className="w-20 h-20 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800">{bus.busName || "Unknown Bus"}</h3>
                    <p className="text-gray-600 mt-1">{bus.busType || "Standard"}</p>
                  </div>
                </div>

                {/* Route & Seats */}
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <FaRoute className="text-green-600 text-2xl" />
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{route.source || "?"} → {route.destination || "?"}</p>
                      <p className="text-gray-500 flex items-center gap-2 mt-1">
                        <FaCalendarAlt className="text-sm" /> {formatDate(booking.journeyDate)}
                        <FaClock className="text-sm ml-4" /> {formatTime(bus.departureTime)} - {formatTime(bus.arrivalTime)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 max-h-[300px] overflow-y-auto">
                    <h4 className="font-semibold mb-2">Selected Seats</h4>
                    {booking.passengers && booking.passengers.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        {booking.passengers.map((p, i) => (
                          <div key={i} className="flex justify-between bg-white p-2 rounded-xl shadow-sm items-center">
                            <span className="font-medium">Seat {p.seatNumber}</span>
                            <span>{p.name}, {p.age} yrs, {p.gender}</span>
                            <span className="font-semibold">{currencySymbol}{p.price || 0}</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-gray-500">Seats info not available</p>}
                  </div>

                  {/* Fare */}
                  <div className="flex items-center gap-3 mt-2">
                    <FaRupeeSign className="text-2xl text-green-600" />
                    <p className="text-3xl font-bold text-green-600">{currencySymbol}{booking.totalAmount || 0}</p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3 mt-2">
                    {status.icon}
                    <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${status.class}`}>{status.label}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 justify-center">
                  {!booking.cancelled && !booking.isCompleted && (
                    <>
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="py-3 border border-red-400 text-red-600 rounded-xl hover:bg-red-50 font-medium transition flex items-center justify-center gap-2"
                      ><FaTimesCircle /> Cancel Booking</button>

                      {!booking.payment && (
                        <button
                          onClick={() => openQRModal(booking)}
                          className="py-3 border border-green-400 text-green-600 rounded-xl hover:bg-green-50 font-medium transition flex items-center justify-center gap-2"
                        ><FaCreditCard /> Pay Now</button>
                      )}
                    </>
                  )}
                </div>

              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyBookings;
