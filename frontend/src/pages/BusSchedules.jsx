// src/pages/BusSchedules.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaBus, FaClock, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import himachalRoutes from '../assets/routesData';

export default function BusSchedules() {
  const uniqueRoutes = [
    'All Routes',
    ...new Set(himachalRoutes.map(route => `${route.origin} - ${route.destination}`))
  ];

  const [selectedRoute, setSelectedRoute] = useState('All Routes');

  const allSchedules = himachalRoutes.flatMap(route =>
    (route.schedules || []).map(schedule => ({
      ...schedule,
      origin: route.origin,
      destination: route.destination,
      routeName: `${route.origin} - ${route.destination}`,
    }))
  );

  const filteredSchedules = selectedRoute === 'All Routes'
    ? allSchedules
    : allSchedules.filter(s => s.routeName === selectedRoute);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - kept simple as per your project */}
      <header className="bg-white shadow-md sticky top-0 z-30 border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium text-lg group">
            <FaArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bus Schedules</h1>
          <p className="text-base text-gray-600">View departure and arrival times for all our routes</p>
        </div>

        {/* Filter */}
        <div className="max-w-md mx-auto mb-10">
          <label htmlFor="route-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Route
          </label>
          <select
            id="route-filter"
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:border-green-600 focus:outline-none bg-white"
          >
            {uniqueRoutes.map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule, index) => (
            <div
              key={`${schedule.routeName}-${schedule.departure}-${index}`}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* green Header with Origin & Destination */}
              <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-lg" />
                  <span className="font-semibold text-lg">{schedule.origin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">{schedule.destination}</span>
                  <FaMapMarkerAlt className="text-lg" />
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                {/* Departure & Arrival */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="text-center">
                    <p className="text-xs uppercase text-gray-500 mb-1">Departure</p>
                    <p className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                      <FaClock className="text-green-600 text-lg" />
                      {schedule.departure}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase text-gray-500 mb-1">Arrival (Next Day)</p>
                    <p className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                      <FaClock className="text-green-600 text-lg" />
                      {schedule.arrival}
                    </p>
                  </div>
                </div>

                {/* Bus Type & Operator */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bus Type</span>
                    <span className="font-medium">{schedule.busType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Operator</span>
                    <span className="font-medium text-green-700">{schedule.operator}</span>
                  </div>
                </div>

                {/* Operating Days */}
                <div className="mt-5 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <FaCalendarAlt className="text-green-600" />
                      Operating Days
                    </span>
                  </div>
                  <div className="flex justify-center gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <span
                        key={day}
                        className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-800 rounded-full text-xs font-medium"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Information */}
        <div className="mt-16 bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Important Information</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-600">•</span>
              <span>Arrival times mentioned are for the next day unless otherwise specified</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600">•</span>
              <span>Please arrive at the boarding point at least 15 minutes before departure</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600">•</span>
              <span>Schedules are subject to change due to weather or road conditions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600">•</span>
              <span>For real-time updates, check your booking confirmation or contact support</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}