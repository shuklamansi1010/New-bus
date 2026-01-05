import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBus, FaClock, FaMapMarkerAlt, FaRoute, FaMountain, FaLock, FaHandsHelping } from "react-icons/fa";
import { AppContext } from "../context/AppContext";

const BusRoutes = () => {
  const navigate = useNavigate();
  const { routes, getAllRoutes } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllRoutes();
  }, []);

  const filteredRoutes = routes.filter((route) => {
    const searchLower = searchQuery.toLowerCase();
    const source = route.source?.toLowerCase() || "";
    const destination = route.destination?.toLowerCase() || "";
    const stops = Array.isArray(route.stops) ? route.stops.join(" ").toLowerCase() : "";
    return source.includes(searchLower) || destination.includes(searchLower) || stops.includes(searchLower);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-30 border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium text-lg">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* SEARCH */}
        <section className="text-center mb-12">
          <input
            type="text"
            placeholder="Search by city or stop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-2xl w-full px-6 py-4 pl-12 border rounded-full focus:ring-4 focus:ring-green-100"
          />
          <FaBus className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
        </section>

        {/* ROUTES GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredRoutes.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 text-xl py-10">
              No routes found matching your search.
            </p>
          ) : (
            filteredRoutes.map((route) => (
              <div key={route._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                <div className="relative w-full h-48 bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
                  <FaBus className="text-white text-6xl opacity-80" />
                  <span className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                    Popular Route
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-green-600" />
                      <h3 className="font-bold text-lg">{route.source || "N/A"}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{route.destination || "N/A"}</h3>
                      <FaMapMarkerAlt className="text-green-600" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <FaClock className="text-green-600" />
                    <span>{route.time || "N/A"} • {route.distance ? `${route.distance} km` : "N/A"}</span>
                  </div>

                  {route.stops?.length > 0 && (
                    <div className="flex gap-2 text-sm text-gray-600 mb-6">
                      <FaRoute className="text-green-600 mt-1" />
                      <p>Stops: {route.stops.join(", ")}</p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate(`/search?from=${route.source}&to=${route.destination}`)}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                    >
                      Search Buses
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default BusRoutes;
