// src/components/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { name: 'Routes', path: '/routes' },
    { name: 'Schedules', path: '/schedules' },
    { name: 'Offers', path: '/offers' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white text-green-600 shadow-lg border-b-4 border-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="UrbanBus Logo" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-lg font-medium hover:text-green-700 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/account"
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FaUserCircle className="text-xl" />
              My Account
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="md:hidden text-2xl text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden bg-white text-green-600 overflow-hidden transition-all duration-300 ease-in-out border-b border-green-200 ${
          isMenuOpen ? 'max-h-96 py-6 opacity-100' : 'max-h-0 py-0 opacity-0'
        }`}
      >
        <div className="px-4 space-y-6 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-lg font-medium hover:text-green-700 transition-colors duration-200 py-2"
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/account"
            className="block flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-md"
            onClick={closeMenu}
          >
            <FaUserCircle className="text-xl" />
            My Account
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;