// src/components/SearchBar.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { HiSearch } from "react-icons/hi";
import { FaBus, FaMapMarkerAlt } from "react-icons/fa";

const SearchBar = ({ className = "" }) => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const cacheRef = useRef({});
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch bus search results
  const fetchResults = async (q) => {
    if (!q || q.trim() === "") {
      setResults([]);
      return;
    }

    const trimmed = q.trim().toLowerCase();

    // Check cache
    if (cacheRef.current[trimmed]) {
      setResults(cacheRef.current[trimmed]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/bus/search`,
        { query: trimmed },
        { headers: {} }
      );

      if (data.success && Array.isArray(data.buses)) {
        const buses = data.buses;
        cacheRef.current[trimmed] = buses;
        setResults(buses);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("SearchBar fetch error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleChange = (e) => setQuery(e.target.value);

  const handleSelect = (bus) => {
    if (!bus || !bus._id) return;
    setQuery("");
    setResults([]);
    navigate(`/bus/${bus._id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setResults([]);
    }
  };

  return (
    <div className={`relative ${className} w-full`} style={{ minWidth: 220, zIndex: 50 }}>
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          placeholder="Search by city, route or destination..."
          className="h-11 flex-1 border border-gray-300 rounded-l-full px-5 pr-12 outline-none text-base shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 h-11 rounded-r-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        >
          <HiSearch className="w-6 h-6" />
        </button>
      </form>

      {/* Search Results Dropdown */}
      {(results.length > 0 || loading) && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-green-600"></div>
              <p className="mt-3 text-gray-600">Searching buses...</p>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((bus) => {
                const route = bus.routeId || {};

                return (
                  <li
                    key={bus._id}
                    onClick={() => handleSelect(bus)}
                    className="p-4 hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0 flex items-center gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <FaBus className="text-2xl text-green-600" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt className="text-green-600 text-sm" />
                        <p className="font-bold text-gray-800 truncate">
                          {route.source || "Unknown"} → {route.destination || "Unknown"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {bus.busName} • {bus.busType}
                      </p>
                      {bus.departureTime && (
                        <p className="text-xs text-gray-500 mt-1">
                          Departs: {bus.departureTime}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ₹{bus.seats?.[0]?.price || "Varies"}
                      </p>
                      <p className="text-xs text-gray-500">onwards</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {results.length > 0 && (
            <div className="p-3 bg-gray-50 text-center">
              <button
                onClick={handleSubmit}
                className="text-green-600 font-medium hover:underline text-sm"
              >
                View all results →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;