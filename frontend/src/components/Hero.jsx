import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBus } from "react-icons/fa";

const Hero = () => {
  const [routes, setRoutes] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/routes`);
        if (!res.data?.routes) return;

        setRoutes(res.data.routes);

        // Extract unique origins and destinations
        const uniqueOrigins = [
          ...new Set(res.data.routes.map((r) => r.source)),
        ];
        const uniqueDestinations = [
          ...new Set(res.data.routes.map((r) => r.destination)),
        ];

        setOrigins(uniqueOrigins);
        setDestinations(uniqueDestinations);
      } catch (err) {
        console.error("Error fetching routes for Hero:", err);
      }
    };

    fetchRoutes();
  }, [backendUrl]);

  const capitalize = (text) =>
    text
      ?.toLowerCase()
      .split(" ")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      alert("Please select origin, destination, and travel date");
      return;
    }
    // Redirect to /buses with query parameters
    navigate(`/buses?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-900 text-white pt-32 pb-32 px-4">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/bus-pattern-light.svg')] bg-repeat" />

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm sm:text-base font-semibold shadow-lg">
          <FaBus className="text-lg" />
          India's Fastest Growing Bus Service
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          Book Bus Tickets Online
        </h1>

        <h2 className="text-2xl md:text-4xl font-semibold mb-6">
          Himachal Pradesh to Delhi & Chandigarh
        </h2>

        <p className="text-lg md:text-xl text-green-100 max-w-4xl mx-auto mb-12 leading-relaxed">
          India's most trusted intercity bus booking platform. Travel from Kalpa, Kinnaur, Spiti Valley,
          McLeod Ganj, Manali, Shimla to Delhi & Chandigarh with comfort, safety, and affordability.
        </p>

        {/* Search Form */}
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <select
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                <option value="">Select origin</option>
                {origins.map((origin) => (
                  <option key={origin} value={origin}>
                    {capitalize(origin)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <select
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                <option value="">Select destination</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {capitalize(dest)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
              <input
                type="date"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl transition shadow-lg"
              >
                Search Buses
              </button>
            </div>
          </form>
        </div>

        {/* Promo Codes */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-full text-sm font-medium">
            First Ride: <strong>20% OFF</strong> <code className="ml-1">FIRST20</code>
          </div>
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-full text-sm font-medium">
            Weekend Special: <strong>₹200 OFF</strong> <code className="ml-1">WEEKEND200</code>
          </div>
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-full text-sm font-medium">
            Student Discount: <strong>15% OFF</strong> <code className="ml-1">STUDENT15</code>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
