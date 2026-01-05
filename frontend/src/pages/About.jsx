// src/pages/About.jsx
import React from "react";
import { FaBus, FaUsers, FaShieldAlt, FaClock } from "react-icons/fa";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About UrbanBus</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          UrbanBus is your reliable and convenient online platform for booking bus tickets.
          We aim to make travel easy, secure, and comfortable for everyone.
        </p>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-green-50 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
          <FaBus className="mx-auto text-green-600 w-12 h-12 mb-4" />
          <h3 className="font-bold text-lg text-gray-800 mb-2">Wide Bus Network</h3>
          <p className="text-gray-600 text-sm">
            Travel across cities with our extensive network of buses.
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
          <FaUsers className="mx-auto text-green-600 w-12 h-12 mb-4" />
          <h3 className="font-bold text-lg text-gray-800 mb-2">Customer Support</h3>
          <p className="text-gray-600 text-sm">
            24/7 support to help you with bookings, cancellations, and queries.
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
          <FaShieldAlt className="mx-auto text-green-600 w-12 h-12 mb-4" />
          <h3 className="font-bold text-lg text-gray-800 mb-2">Safe & Secure</h3>
          <p className="text-gray-600 text-sm">
            Your personal and payment data are protected with top-notch security.
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
          <FaClock className="mx-auto text-green-600 w-12 h-12 mb-4" />
          <h3 className="font-bold text-lg text-gray-800 mb-2">Timely Travel</h3>
          <p className="text-gray-600 text-sm">
            Punctual buses and real-time updates to ensure smooth journeys.
          </p>
        </div>
      </section>

      {/* About Details / Story */}
      <section className="bg-gray-50 rounded-2xl p-8 shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Mission</h2>
        <p className="text-gray-600 text-lg mb-4 text-center max-w-3xl mx-auto">
          At UrbanBus, our mission is to make bus travel hassle-free and enjoyable. 
          We focus on providing reliable services, easy booking experience, and timely support.
        </p>
        <p className="text-gray-600 text-lg text-center max-w-3xl mx-auto">
          Since our inception, we have served thousands of travelers across multiple cities,
          ensuring comfort, safety, and convenience in every journey.
        </p>
      </section>
    </div>
  );
};

export default About;
