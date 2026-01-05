// src/pages/SearchBuses.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBus, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaChair, FaRupeeSign, FaSearch } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const SearchBuses = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query params from URL (e.g., ?from=Manali&to=Delhi&date=2026-01-15)
  const queryParams = new URLSearchParams(location.search);
  const initialFrom = queryParams.get("from") || "";
  const initialTo = queryParams.get("to") || "";
  const initialDate = queryParams.get("date") || "";

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(initialDate);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!from.trim() || !to.trim() || !date) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    setNoResults(false);

    try {
      const { data } = await axios.post(`${backendUrl}/api/bus/search`, {
        from: from.trim(),
        to: to.trim(),
        date,
      });

      if (data.success) {
        setBuses(data.buses || []);
        setNoResults(data.buses?.length === 0);
      } else {
        setBuses([]);
        setNoResults(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setBuses([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }

    // Update URL
    navigate(`/buses?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
  };

  // Auto-search if params exist on load
  useEffect(() => {
    if (initialFrom && initialTo && initialDate) {
      handleSearch({ preventDefault: () => {} });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaSearch className="text-green-600" />
            Search Buses
          </h1>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-green-600" />
                From
              </label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="e.g., Manali"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-green-600" />
                To
              </label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="e.g., Delhi"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2 text-green-600" />
                Travel Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <FaSearch />
                {loading ? "Searching..." : "Search Buses"}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
            <p className="mt-6 text-xl text-gray-600">Searching for available buses...</p>
          </div>
        ) : noResults ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <FaBus className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <p className="text-2xl font-semibold text-gray-700 mb-4">No Buses Found</p>
            <p className="text-gray-600">Try different cities or dates</p>
          </div>
        ) : buses.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Available Buses ({buses.length})
            </h2>

            {buses.map((bus) => {
              const route = bus.routeId || {};

              return (
                <div
                  key={bus._id}
                  onClick={() => navigate(`/bus/${bus._id}`)}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all cursor-pointer border border-gray-100"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Bus Info */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                          <FaBus className="text-3xl text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{bus.busName}</h3>
                          <p className="text-gray-600">{bus.busType}</p>
                        </div>
                      </div>
                    </div>

                    {/* Route & Timing */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-green-600" />
                        <p className="font-medium">
                          {route.source} → {route.destination}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <FaClock />
                        <span>{bus.departureTime} - {bus.arrivalTime}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <FaCalendarAlt />
                        <span>{date || "Selected Date"}</span>
                      </div>
                    </div>

                    {/* Amenities & Seats */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FaChair className="text-green-600" />
                        <span className="font-medium">
                          {bus.availableSeats || bus.seats?.filter(s => !s.isBooked).length || 0} seats available
                        </span>
                      </div>
                      {bus.amenities && bus.amenities.length > 0 && (
                        <p className="text-sm text-gray-600">
                          Amenities: {bus.amenities.join(", ")}
                        </p>
                      )}
                    </div>

                    {/* Price & CTA */}
                    <div className="text-right flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="text-3xl font-bold text-green-600">
                          ₹{bus.seats?.[0]?.price || "N/A"}
                        </p>
                      </div>
                      <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition">
                        Select Seats →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBuses;