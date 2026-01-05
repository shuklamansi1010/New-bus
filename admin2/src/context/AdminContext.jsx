import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [aToken, setAToken] = useState(() => localStorage.getItem("aToken") || "");
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashData, setDashData] = useState(null);
  const [dashLoading, setDashLoading] = useState(false);

  // -------------------- HELPER --------------------
  const getAuthHeaders = () => ({
    headers: { aToken: aToken || "" },
  });

  // -------------------- AUTH --------------------
  const saveToken = (token) => {
    if (token) {
      setAToken(token);
      localStorage.setItem("aToken", token);
    }
  };

  const logoutAdmin = () => {
    setAToken("");
    localStorage.removeItem("aToken");
    setBuses([]);
    setRoutes([]);
    setBookings([]);
    setUsers([]);
    setDashData(null);
    toast.info("Logged out successfully");
  };

  // -------------------- DASHBOARD --------------------
  const getDashData = async () => {
    if (!aToken) return; // skip if no token
    setDashLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, getAuthHeaders());
      if (data.success) setDashData(data.dashboard);
      else toast.error(data.message || "Failed to load dashboard");
    } catch (error) {
      console.error("Dashboard Error:", error);
      console.error("Full response:", error.response);
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setDashLoading(false);
    }
  };

  // -------------------- BUSES --------------------
  const getAllBuses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/buses`, getAuthHeaders());
      if (data.success) setBuses(data.buses || []);
      else toast.error(data.message || "Failed to fetch buses");
    } catch (error) {
      console.error("Get Buses Error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch buses");
    }
  };

  const addBus = async (formData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/add-bus`, formData, getAuthHeaders());
      if (data.success) {
        toast.success(data.message || "Bus added successfully!");
        await getAllBuses();
        return true;
      } else {
        toast.error(data.message || "Failed to add bus");
        return false;
      }
    } catch (error) {
      console.error("Add Bus Error:", error);
      toast.error(error.response?.data?.message || "Failed to add bus");
      return false;
    }
  };

  const updateBus = async (busId, busData) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/admin/update-bus/${busId}`, busData, getAuthHeaders());
      if (data.success) {
        toast.success(data.message || "Bus updated successfully!");
        await getAllBuses();
        return true;
      } else {
        toast.error(data.message || "Failed to update bus");
        return false;
      }
    } catch (error) {
      console.error("Update Bus Error:", error);
      toast.error(error.response?.data?.message || "Failed to update bus");
      return false;
    }
  };

  const deleteBus = async (busId) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;
    try {
      const { data } = await axios.delete(`${backendUrl}/api/admin/delete-bus/${busId}`, getAuthHeaders());
      if (data.success) {
        toast.success(data.message || "Bus deleted successfully!");
        await getAllBuses();
      } else toast.error(data.message || "Failed to delete bus");
    } catch (error) {
      console.error("Delete Bus Error:", error);
      toast.error(error.response?.data?.message || "Failed to delete bus");
    }
  };

  // -------------------- ROUTES --------------------
  const getAllRoutes = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/routes`, getAuthHeaders());
      if (data.success) setRoutes(data.routes || []);
      else toast.error(data.message || "Failed to fetch routes");
    } catch (error) {
      console.error("Get Routes Error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch routes");
    }
  };

  const addRoute = async (routeData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/add-route`, routeData, getAuthHeaders());
      if (data.success) {
        toast.success(data.message || "Route added successfully!");
        await getAllRoutes();
        return true;
      } else {
        toast.error(data.message || "Failed to add route");
        return false;
      }
    } catch (error) {
      console.error("Add Route Error:", error);
      toast.error(error.response?.data?.message || "Failed to add route");
      return false;
    }
  };

  // -------------------- BOOKINGS --------------------
  const getAllBookings = async () => {
    if (!aToken) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/bookings`, getAuthHeaders());
      if (data.success) setBookings(data.bookings || []);
      else toast.error(data.message || "Failed to fetch bookings");
    } catch (error) {
      console.error("Get Bookings Error:", error);
      console.error("Full response:", error.response);
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/cancel-booking`, { bookingId }, getAuthHeaders());
      if (data.success) {
        toast.success(data.message || "Booking cancelled successfully");
        await getAllBookings();
      } else toast.error(data.message || "Failed to cancel booking");
    } catch (error) {
      console.error("Cancel Booking Error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  // -------------------- USERS --------------------
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/users`, getAuthHeaders());
      if (data.success) setUsers(data.users || []);
      else toast.error(data.message || "Failed to fetch users");
    } catch (error) {
      console.error("Get Users Error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  };

  // -------------------- CONTEXT VALUE --------------------
  const value = {
    aToken,
    setAToken: saveToken,
    logoutAdmin,

    dashData,
    dashLoading,
    getDashData,

    buses,
    getAllBuses,
    addBus,
    updateBus,
    deleteBus,

    routes,
    getAllRoutes,
    addRoute,

    bookings,
    getAllBookings,
    cancelBooking,

    users,
    getAllUsers,
  };

  // -------------------- AUTO FETCH DASHBOARD --------------------
  useEffect(() => {
    if (aToken) {
      getDashData();
      getAllBookings();
    }
  }, [aToken]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminContextProvider;
