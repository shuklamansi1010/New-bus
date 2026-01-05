import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">UrbanBus</h2>
          <p className="text-sm leading-relaxed">
            India's most trusted intercity bus booking platform.
            Travel safe, travel comfortable.
          </p>
        </div>

        {/* Top Routes */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Top Routes
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/kalpa-to-delhi" className="hover:text-white">Kalpa to Delhi</Link></li>
            <li><Link to="/kinnaur-to-delhi" className="hover:text-white">Kinnaur to Delhi</Link></li>
            <li><Link to="/mcleodganj-to-delhi" className="hover:text-white">McLeod Ganj to Delhi</Link></li>
            <li><Link to="/spiti-valley-to-delhi" className="hover:text-white">Spiti Valley to Delhi</Link></li>
            <li><Link to="/manali-to-delhi" className="hover:text-white">Manali to Delhi</Link></li>
            <li><Link to="/shimla-to-delhi" className="hover:text-white">Shimla to Delhi</Link></li>
            <li><Link to="/kalpa-to-chandigarh" className="hover:text-white">Kalpa to Chandigarh</Link></li>
            <li><Link to="/kinnaur-to-chandigarh" className="hover:text-white">Kinnaur to Chandigarh</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/refund-policy" className="hover:text-white">Refund Policy</Link></li>
            <li><Link to="/routes" className="hover:text-white">Routes</Link></li>
            <li><Link to="/schedules" className="hover:text-white">Schedules</Link></li>
            <li><Link to="/offers" className="hover:text-white">Offers</Link></li>
            <li><Link to="/admin" className="hover:text-white">Admin</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Contact
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              Email:{" "}
              <a
                href="mailto:support@urbanbus.in"
                className="hover:text-white"
              >
                support@urbanbus.in
              </a>
            </li>
            <li>
              Phone:{" "}
              <a href="tel:+918383989274" className="hover:text-white">
                +91 8383989274
              </a>
            </li>
            <li className="text-green-600">Support: 24/7 Available</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 py-4 text-center text-sm text-slate-400">
        © 2025 UrbanBus. All rights reserved. Your journey, our priority.
      </div>
    </footer>
  );
};

export default Footer;
