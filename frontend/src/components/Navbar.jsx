// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios"; 
import logo from "../assets/logo.png";

// Icons
import {
  FaHome,
  FaRoute,
  FaTag,
  FaInfoCircle,
  FaEnvelope,
  FaTicketAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaBus,
} from "react-icons/fa";

// Navigation links
const NAV_LINKS = [
  { label: "HOME", path: "/", icon: <FaHome /> },
  { label: "ALL ROUTES", path: "/routes", icon: <FaRoute /> },
  { label: "BOOK BUS", path: "/search", icon: <FaBus /> },
  { label: "OFFERS", path: "/offers", icon: <FaTag /> },
  { label: "ABOUT", path: "/about", icon: <FaInfoCircle /> },
  { label: "CONTACT", path: "/contact", icon: <FaEnvelope /> },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  // Search handler (optional)
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${searchInput}`);
      setMenuOpen(false);
    }
  };

  return (
    <nav className="flex items-center justify-between py-4 px-4 sm:px-8 lg:px-12 h-20 border-b border-gray-100 sticky top-0 bg-white z-50 shadow-sm">
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className="h-10 sm:h-12 hover:opacity-80 transition" />
      </div>

      {/* Desktop nav links */}
      <ul className="hidden md:flex items-center gap-6 lg:gap-10 font-medium text-gray-600">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.label} to={link.path}>
            {({ isActive }) => (
              <li
                className={`flex items-center gap-2 pb-1.5 relative transition-colors duration-300 ${
                  isActive ? "text-green-600" : "hover:text-black"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-green-600 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0"
                  }`}
                />
              </li>
            )}
          </NavLink>
        ))}
      </ul>

      

      {/* Right actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {!token ? (
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-7 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <FaSignInAlt /> Sign In
          </button>
        ) : (
          <div className="relative group p-1">
            <div className="rounded-full border-2 border-transparent group-hover:border-green-600 transition-all duration-300 p-0.5">
              {userData?.image ? (
                <img
                  src={userData.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover shadow hover:shadow-md transition-shadow ring-2 ring-white"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-400" />
              )}
            </div>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="min-w-60 bg-white rounded-xl shadow-lg border border-gray-50 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    My Account
                  </p>
                </div>
                <div
                  onClick={() => navigate("/my-bookings")}
                  className="px-4 py-3.5 text-sm font-medium hover:bg-gray-50 hover:text-green-600 cursor-pointer flex items-center gap-3"
                >
                  <FaTicketAlt className="text-green-600" /> My Bookings
                </div>
                <div
                  onClick={logout}
                  className="px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 cursor-pointer flex items-center gap-3"
                >
                  <FaSignOutAlt /> Logout
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 relative z-50"
        >
          {menuOpen ? <FaTimes className="w-7 h-7 text-gray-600" /> : <FaBars className="w-7 h-7 text-gray-600" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-[40] flex flex-col pt-20 transition-all duration-500">
          <div className="px-6 pb-8">
            {/* <SearchBar
              className="w-full h-11 shadow-sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onSubmit={handleSearch}
            /> */}
          </div>

          <ul className="flex flex-col px-6 gap-2">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.label} to={link.path} onClick={() => setMenuOpen(false)}>
                <li className="py-4 px-6 text-xl font-bold rounded-2xl transition-all flex items-center gap-4 hover:bg-green-50">
                  {link.icon}
                  {link.label}
                </li>
              </NavLink>
            ))}
          </ul>

          <div className="mt-auto p-6 border-t border-gray-50">
            {!token ? (
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black flex items-center justify-center gap-3"
              >
                <FaSignInAlt /> SIGN IN
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black flex items-center justify-center gap-3"
              >
                <FaSignOutAlt /> LOGOUT
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
