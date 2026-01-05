import React, { useContext, useEffect, useState } from "react";
import { FaBus, FaUsers, FaClipboardList, FaRoute } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

// Color Palette
const PRIMARY_GREEN = "#00A36C";
const HOVER_GREEN = "#008557";
const ACCENT_COLOR = "#E6F6F0";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    aToken,
    getDashData,
    dashData,
    dashLoading,
    dashError,
    getAllBookings,
    cancelBooking,
  } = useContext(AdminContext);
  const { slotDateFormat, currency } = useContext(AppContext);

  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (aToken && !dashData && !dashLoading) {
      fetchDashboardData();
    }
  }, [aToken]);

  const fetchDashboardData = async () => {
    setRetrying(true);
    await getDashData();
    await getAllBookings(); // Optional: refresh bookings list if needed
    setRetrying(false);
  };

  // No admin token
  if (!aToken) {
    return (
      <div className="p-8 text-center text-xl text-red-600 bg-gray-50 min-h-screen flex items-center justify-center">
        <div>
          <p>Access Denied: Admin login required.</p>
          <button
            onClick={() => navigate("/admin-login")}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (dashError) {
    return (
      <div className="p-8 text-center bg-gray-50 min-h-screen flex items-center justify-center">
        <div>
          <p className="text-2xl text-red-600 mb-4">Failed to load dashboard data</p>
          <p className="text-gray-600 mb-6">{dashError}</p>
          <button
            onClick={fetchDashboardData}
            disabled={retrying}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {retrying ? "Retrying..." : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (dashLoading || !dashData || retrying) {
    return (
      <div className="p-8 text-center bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mb-4"></div>
        <p className="text-xl text-gray-600">Loading Dashboard Data...</p>
      </div>
    );
  }

  // Handle both possible API response shapes:
  // 1. { stats: { ... }, latestBookings: [...] }
  // 2. { totalBuses, totalRoutes, ..., latestBookings: [...] }  ← your current backend
  const stats = dashData.stats || dashData;

  if (!stats || typeof stats !== "object") {
    return (
      <div className="p-8 text-center text-orange-600 bg-gray-50 min-h-screen">
        <p>Invalid dashboard data structure.</p>
        <pre className="mt-4 text-left bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(dashData, null, 2)}
        </pre>
      </div>
    );
  }

  const latestBookings = Array.isArray(dashData.latestBookings)
    ? dashData.latestBookings
    : [];

  const {
    totalBuses = 0,
    totalRoutes = 0,
    totalBookings = 0,
    totalUsers = 0,
  } = stats;

  const StatCard = ({ title, count, IconComponent, path }) => (
    <div
      onClick={() => navigate(path)}
      className="flex items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-lg border-l-4 min-w-[220px] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      style={{ borderColor: PRIMARY_GREEN }}
    >
      <div className="flex flex-col">
        <p className="text-3xl font-extrabold text-gray-800">{count}</p>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </p>
      </div>
      <div
        className="w-14 h-14 flex items-center justify-center rounded-full p-2"
        style={{ backgroundColor: ACCENT_COLOR }}
      >
        <IconComponent className="w-8 h-8" style={{ color: PRIMARY_GREEN }} />
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🚌 Admin Dashboard</h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Buses"
          count={totalBuses}
          IconComponent={FaBus}
          path="/admin/buses"
        />
        <StatCard
          title="Total Routes"
          count={totalRoutes}
          IconComponent={FaRoute}
          path="/admin/routes"
        />
        <StatCard
          title="Total Users"
          count={totalUsers}
          IconComponent={FaUsers}
          path="/admin/users"
        />
        <StatCard
          title="Total Bookings"
          count={totalBookings}
          IconComponent={FaClipboardList}
          path="/admin/bookings"
        />
      </div>

      {/* Latest Bookings Table */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        <div
          className="flex items-center gap-3 px-6 py-4 border-b bg-gray-50"
          style={{ borderBottom: `2px solid ${PRIMARY_GREEN}` }}
        >
          <FaClipboardList className="w-6 h-6" style={{ color: PRIMARY_GREEN }} />
          <p className="text-xl font-semibold text-gray-800">
            Latest Bookings (Last 5)
          </p>
        </div>

        {/* Table Header - Hidden on mobile */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2.5fr_3fr_2fr_1fr_0.5fr] py-4 px-6 border-b text-sm font-bold text-gray-600 uppercase tracking-wider bg-gray-100">
          <p>ID</p>
          <p>Customer</p>
          <p>Bus & Route</p>
          <p>Seats</p>
          <p>Status</p>
          <p>Action</p>
        </div>

        {/* Table Body */}
        <div className="text-sm max-h-[500px] overflow-y-auto">
          {latestBookings.length > 0 ? (
            latestBookings.slice(0, 5).map((booking, index) => {
              const user = booking.userId || {};
              const bus = booking.busId || {};
              const route = bus.routeId || {};
              const seats = Array.isArray(booking.seats) ? booking.seats : [];
              const isCancelled = booking.cancelled;

              return (
                <div
                  key={booking._id || index}
                  className={`flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2.5fr_3fr_2fr_1fr_0.5fr] items-center text-gray-600 py-4 px-6 border-b last:border-b-0 transition-colors hover:bg-green-50/50 ${
                    isCancelled ? "bg-red-50/50 opacity-80" : ""
                  }`}
                >
                  {/* ID - Hidden on mobile */}
                  <p className="max-sm:hidden font-medium text-gray-500">
                    #{index + 1}
                  </p>

                  {/* Customer */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <img
                      src={user.image || assets.default_user}
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      onError={(e) => (e.target.src = assets.default_user)}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {user.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">
                        {user.email || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Bus & Route */}
                  <div>
                    <p className="font-medium">{bus.busName || "Unknown Bus"}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="font-semibold">
                        {route.source || "N/A"}
                      </span>{" "}
                      →{" "}
                      <span className="font-semibold">
                        {route.destination || "N/A"}
                      </span>
                    </p>
                  </div>

                  {/* Seats */}
                  <p className="font-mono text-xs p-1 bg-gray-100 rounded text-center">
                    {seats.length > 0
                      ? seats.map((s) => s.seatNumber).join(", ")
                      : "-"}{" "}
                    ({seats.length})
                  </p>

                  {/* Status */}
                  <div className="max-sm:order-last max-sm:w-full">
                    {isCancelled ? (
                      <span className="text-red-600 bg-red-100 text-xs font-bold px-3 py-1 rounded-full">
                        CANCELLED
                      </span>
                    ) : (
                      <span className="text-green-600 bg-green-100 text-xs font-bold px-3 py-1 rounded-full">
                        CONFIRMED
                      </span>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    {!isCancelled && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="p-2 rounded-full hover:bg-red-100 transition-colors"
                        title="Cancel Booking"
                      >
                        <MdCancel className="w-6 h-6 text-red-500 opacity-70 hover:opacity-100" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="px-6 py-12 text-center text-lg text-gray-500">
              No recent bookings found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;