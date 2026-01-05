import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "₹";
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // -------------------- AUTH --------------------
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);

  // ---------------- PUBLIC DATA -----------------
  const [routes, setRoutes] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // ------------------- NOTIFICATIONS ----------------
  const showNotification = useCallback((message, type = "success") => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "success", message: "" });
    }, 3000);
  }, []);

  // ------------------- LOGIN --------------------
  const loginUser = useCallback(
    async (email, password) => {
      try {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          await loadUserProfileData(data.token);
          showNotification("Login successful! 🚍", "success");
          return true;
        } else {
          showNotification(data.message || "Invalid credentials", "error");
          return false;
        }
      } catch (error) {
        showNotification(
          error.response?.data?.message || "Login failed. Try again.",
          "error"
        );
        return false;
      }
    },
    [backendUrl, showNotification]
  );

  // ------------------- SIGNUP -------------------
  const signupUser = useCallback(
    async (name, email, password, phone) => {
      try {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
          phone,
        });

        if (data.success) {
          showNotification("Account created successfully! 🎉", "success");
          return true;
        } else {
          showNotification(data.message || "Registration failed", "error");
          return false;
        }
      } catch (error) {
        showNotification(
          error.response?.data?.message || "Something went wrong.",
          "error"
        );
        return false;
      }
    },
    [backendUrl, showNotification]
  );

  // ------------------- LOGOUT -------------------
  const logoutUser = useCallback(() => {
    localStorage.removeItem("token");
    setToken("");
    setUserData(null);
    showNotification("Logged out successfully 👋", "success");
  }, [showNotification]);

  // ------------------- LOAD USER PROFILE -------------------
  const loadUserProfileData = async (authToken = token) => {
    if (!authToken) return;

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        logoutUser();
      }
    } catch (err) {
      console.error("Failed to load profile:", err.response?.data || err.message);
      logoutUser();
    }
  };

  // ------------------- PUBLIC DATA -------------------
  const getAllRoutes = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/routes`);
      if (data.success && Array.isArray(data.routes)) {
        setRoutes(data.routes);
      } else {
        setRoutes([]);
      }
    } catch (err) {
      console.error("Failed to load routes:", err);
      setRoutes([]);
    }
  }, [backendUrl]);

  // ------------------- GET BUS DETAILS -------------------
  const getBusDetails = async (busId) => {
    try {
      if (!busId) return null;
      const { data } = await axios.get(`${backendUrl}/api/user/bus/${busId}`);
      return data.success ? data.bus : null;
    } catch (err) {
      console.error("Get Bus Details Error:", err);
      showNotification("Failed to fetch bus details", "error");
      return null;
    }
  };

  // ------------------- SEARCH BUSES -------------------
  const busCacheRef = useRef({});
  const searchBuses = useCallback(
    async (from, to, date) => {
      const key = `${from}_${to}_${date}`;
      const busCache = busCacheRef.current;

      if (busCache[key]) return busCache[key];

      try {
        const { data } = await axios.get(`${backendUrl}/api/user/buses`, {
          params: { from, to, date },
        });

        if (data.success) {
          busCache[key] = data.buses || [];
          return busCache[key];
        }

        showNotification("No buses found", "warning");
        return [];
      } catch (err) {
        console.error("Search failed:", err);
        showNotification("Search failed. Try again.", "error");
        return [];
      }
    },
    [backendUrl, showNotification]
  );

  // ------------------- BOOKING LOGIC -------------------
  const bookBus = async (busId, seatNumbers) => {
    if (!token) {
      showNotification("Please login to book tickets.", "warning");
      return null;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book`,
        { busId, seatNumbers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        showNotification("Booking successful! 🎫", "success");
        return data.booking;
      } else {
        showNotification(data.message || "Booking failed", "error");
        return null;
      }
    } catch (err) {
      console.error("Booking Error:", err.response?.data || err.message);
      showNotification(err.response?.data?.message || "Booking failed", "error");
      return null;
    }
  };

  const listBookings = async () => {
    if (!token) return [];

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data.success ? data.bookings : [];
    } catch (err) {
      console.error("List Bookings Error:", err);
      showNotification("Failed to fetch bookings", "error");
      return [];
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!token) return false;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/user/booking/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        showNotification("Booking cancelled ✅", "success");
        return true;
      } else {
        showNotification(data.message || "Cancel failed", "error");
        return false;
      }
    } catch (err) {
      console.error("Cancel Booking Error:", err);
      showNotification(err.response?.data?.message || "Cancel failed", "error");
      return false;
    }
  };

  // ------------------- AUTO LOAD ON MOUNT -------------------
  useEffect(() => {
    getAllRoutes();
  }, [getAllRoutes]);

  useEffect(() => {
    if (token) loadUserProfileData();
  }, [token]);

  // ------------------- CONTEXT VALUE -------------------
  const value = {
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loginUser,
    signupUser,
    logoutUser,
    loadUserProfileData,
    routes,
    setRoutes,
    getAllRoutes,
    getBusDetails,
    searchBuses,
    bookBus,
    listBookings,
    cancelBooking,
    notification,
    showNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
