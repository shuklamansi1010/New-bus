// src/pages/BusList.jsx
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBus,
  FaClock,
  FaChair,
  FaStar,
  FaWifi,
  FaSnowflake,
  FaBolt,
  FaTv,
} from "react-icons/fa";
import { AppContext } from "../context/AppContext";

const BusList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchBuses } = useContext(AppContext);

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInfo, setSearchInfo] = useState({ from: "", to: "", date: "" });

  // Map amenities to icons
  const getAmenityIcon = (amenity) => {
    if (!amenity) return <FaStar className="text-gray-600" />;
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <FaWifi className="text-blue-600" />;
      case "ac":
        return <FaSnowflake className="text-cyan-600" />;
      case "charging port":
        return <FaBolt className="text-yellow-600" />;
      case "tv":
        return <FaTv className="text-purple-600" />;
      default:
        return <FaStar className="text-gray-600" />;
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const from = queryParams.get("from") || "";
    const to = queryParams.get("to") || "";
    const date = queryParams.get("date") || "";

    if (!from || !to || !date) {
      navigate("/search");
      return;
    }

    setSearchInfo({ from, to, date });

    const fetchBuses = async () => {
      try {
        setLoading(true);
        const results = await searchBuses(from, to, date);

        if (Array.isArray(results)) setBuses(results);
        else if (results && Array.isArray(results.buses)) setBuses(results.buses);
        else setBuses([]);
      } catch (err) {
        console.error("Failed to fetch buses:", err);
        setBuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [location.search, navigate, searchBuses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
          <p className="mt-6 text-xl text-gray-600">Finding the best buses for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Search Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Buses from <span className="text-green-600">{searchInfo.from}</span> to{" "}
            <span className="text-green-600">{searchInfo.to}</span>
          </h1>
          <p className="text-lg text-gray-600">
            Journey Date:{" "}
            <span className="font-semibold">
              {searchInfo.date ? new Date(searchInfo.date).toDateString() : "N/A"}
            </span>{" "}
            • {buses.length} bus{buses.length !== 1 ? "es" : ""} available
          </p>
        </div>

        {/* No Results */}
        {buses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <FaBus className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">No Buses Found</h2>
            <p className="text-gray-600 mb-8">
              Sorry, no buses are available for this route and date.
            </p>
            <button
              onClick={() => navigate("/search")}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg transition"
            >
              Search Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {buses.map((bus) => {
              const route = bus.routeId || {};
              const availableSeats = bus.seats?.filter((s) => !s.isBooked)?.length || 0;
              const minPrice =
                bus.seats?.length > 0 ? Math.min(...bus.seats.map((s) => s.price)) : 0;

              return (
                <div
                  key={bus._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
                  onClick={() =>
                    navigate(`/bookbus/${bus._id}?date=${searchInfo.date}`)
                  }
                >
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Bus Info */}
                      <div className="lg:col-span-1 flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                          <FaBus className="text-3xl text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{bus.busName}</h3>
                          <p className="text-gray-600 font-medium">{bus.busType}</p>
                        </div>
                      </div>

                      {/* Timing & Route */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FaClock className="text-green-600" />
                          <div>
                            <p className="font-semibold">
                              {bus.departureTime} → {bus.arrivalTime}
                            </p>
                            <p className="text-sm text-gray-500">{route.time || "Duration varies"}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {route.source} → {route.destination}
                        </p>
                      </div>

                      {/* Amenities & Seats */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 flex-wrap">
                          {bus.amenities?.slice(0, 5).map((amenity, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              {getAmenityIcon(amenity)}
                              <span className="text-gray-700">{amenity}</span>
                            </div>
                          ))}
                          {bus.amenities?.length > 5 && (
                            <span className="text-sm text-gray-500">
                              +{bus.amenities.length - 5} more
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <FaChair className="text-green-600" />
                          <span className="font-semibold text-lg">{availableSeats} seats available</span>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="text-right flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Starting from</p>
                          <p className="text-3xl font-bold text-green-600">₹{minPrice}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/bookbus/${bus._id}?date=${searchInfo.date}`);
                          }}
                          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition"
                        >
                          View Seats →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusList;
