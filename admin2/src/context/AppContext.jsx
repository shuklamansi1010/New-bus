// src/context/AppContext.jsx
import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  // ------------------------------
  // Config Variables
  // ------------------------------
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  // ------------------------------
  // App State
  // ------------------------------
  const [userToken, setUserToken] = useState(localStorage.getItem("token") || "");
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notification, setNotification] = useState(null);

  // ------------------------------
  // Notification Handlers
  // ------------------------------
  const showNotification = (type, message, title) => {
    setNotification({ type, message, title });
  };

  const hideNotification = () => setNotification(null);

  // ------------------------------
  // API Calls
  // ------------------------------
  const getAllBuses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/buses`, {
        headers: { token: userToken },
      });
      if (data.success) setBuses(data.buses);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message || "Failed to fetch buses");
    }
  };

  const getAllRoutes = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/routes`, {
        headers: { token: userToken },
      });
      if (data.success) setRoutes(data.routes);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message || "Failed to fetch routes");
    }
  };

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/bookings`, {
        headers: { token: userToken },
      });
      if (data.success) setBookings(data.bookings);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message || "Failed to fetch bookings");
    }
  };

  const bookTicket = async (busId, routeId, seatNo) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/bookings`,
        { busId, routeId, seatNo },
        { headers: { token: userToken } }
      );
      if (data.success) {
        toast.success("Ticket booked successfully!");
        getAllBookings();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to book ticket");
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/bookings/cancel`,
        { bookingId },
        { headers: { token: userToken } }
      );
      if (data.success) {
        toast.success("Booking cancelled!");
        getAllBookings();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to cancel booking");
    }
  };

  // ------------------------------
  // Context Values
  // ------------------------------
  const value = {
    backendUrl,
    currency,
    userToken,
    setUserToken,

    buses,
    routes,
    bookings,

    getAllBuses,
    getAllRoutes,
    getAllBookings,
    bookTicket,
    cancelBooking,

    notification,
    showNotification,
    hideNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
