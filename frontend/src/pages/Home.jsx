// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BusRouteCard from '../components/BusRouteCard';
import Hero from '../components/Hero';
import {
  FaBus,
  FaShieldAlt,
  FaRupeeSign,
  FaMountain,
  FaClock,
  FaStar,
  FaUsers,
  FaRoute,
  FaCheckCircle,
} from 'react-icons/fa';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80';



export default function Home() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${backendUrl}/api/user/routes`);
        console.log('API Response:', response.data); // For debugging (remove later if you want)

        let routesArray = [];

        // Handle common response formats
        if (Array.isArray(response.data)) {
          routesArray = response.data;
        } else if (response.data?.routes && Array.isArray(response.data.routes)) {
          routesArray = response.data.routes;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          routesArray = response.data.data;
        } else {
          throw new Error('Invalid routes data format');
        }

        // Map exactly to your schema
        const formattedRoutes = routesArray.map((route) => ({
          _id: route._id,
          source: route.source
            ? route.source.charAt(0).toUpperCase() + route.source.slice(1).toLowerCase()
            : 'Unknown',
          destination: route.destination
            ? route.destination.charAt(0).toUpperCase() + route.destination.slice(1).toLowerCase()
            : 'Unknown',
          time: route.duration || 'Varies', // Your schema uses "duration", not "time"
          image: PLACEHOLDER_IMAGE, // You can add image field later
        }));

        setRoutes(formattedRoutes);
      } catch (err) {
        console.error('Error fetching routes:', err);
        setError('Failed to load routes. Check if backend is running.');
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [backendUrl]);

  const formatDuration = (time) => time || 'Varies';

  // Capitalize first letter of each word (for better display)
  const capitalizeCity = (city) =>
    city
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return (
    <>
     
      <main className="pt-20">
        <Hero />

        {/* Stats */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Best Online Bus Booking Service in Himachal Pradesh
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-10 bg-gray-50 rounded-2xl shadow-sm hover:shadow-lg transition">
                <FaRoute className="text-6xl text-green-600 mx-auto mb-4" />
                <div className="text-5xl font-black text-green-600 mb-2">{routes.length}+</div>
                <h3 className="text-2xl font-bold mb-3">Bus Routes</h3>
                <p className="text-gray-600">Extensive network across Himachal</p>
              </div>
              <div className="text-center p-10 bg-gray-50 rounded-2xl shadow-sm hover:shadow-lg transition">
                <FaUsers className="text-6xl text-green-600 mx-auto mb-4" />
                <div className="text-5xl font-black text-green-600 mb-2">1M+</div>
                <h3 className="text-2xl font-bold mb-3">Happy Travelers</h3>
                <p className="text-gray-600">Over 1 million satisfied customers</p>
              </div>
              <div className="text-center p-10 bg-gray-50 rounded-2xl shadow-sm hover:shadow-lg transition">
                <FaStar className="text-6xl text-green-600 mx-auto mb-4" />
                <div className="text-5xl font-black text-green-600 mb-2">4.9★</div>
                <h3 className="text-2xl font-bold mb-3">Rating</h3>
                <p className="text-gray-600">Consistently top-rated platform</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Routes */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
              Popular Bus Routes from Himachal Pradesh
            </h2>
            <p className="text-center text-gray-600 text-lg mb-12">
              Most traveled intercity bus routes with best prices and comfort
            </p>

            {loading ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500">Loading routes...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-xl text-red-600">{error}</p>
              </div>
            ) : routes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500">No routes available yet. Add some in admin panel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {routes.map((route) => (
                  <BusRouteCard
                    key={route._id}
                    from={capitalizeCity(route.source)}
                    to={capitalizeCity(route.destination)}
                    duration={formatDuration(route.time)}
                    image={route.image}
                    routeId={route._id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Why Choose UrbanBus?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center">
              {[
                { icon: FaBus, title: 'Modern Fleet', desc: 'Well-maintained & comfortable buses' },
                { icon: FaShieldAlt, title: 'Safe Journey', desc: 'GPS tracked & experienced drivers' },
                { icon: FaRupeeSign, title: 'Best Prices', desc: 'Affordable fares & exclusive offers' },
                { icon: FaMountain, title: 'Mountain Expert', desc: 'Professional drivers for Himalayan roads' },
                { icon: FaClock, title: 'On Time', desc: 'Punctual departures & arrivals' },
              ].map((f) => (
                <div key={f.title} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                  <f.icon className="text-6xl mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                  <p className="text-green-100">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guide Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
              Complete Guide to Bus Travel in Himachal Pradesh
            </h2>
            <p className="text-center text-gray-600 text-xl mb-16">
              Everything you need to know about booking buses from Himachal's most popular destinations
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-8">Why Choose UrbanBus for Himachal Travel?</h3>
                <ul className="space-y-6 text-gray-700">
                  <li className="flex items-start gap-4">
                    <FaCheckCircle className="text-green-600 text-3xl mt-1 flex-shrink-0" />
                    <div><strong>Best Routes Coverage</strong><br />Direct buses from major Himachal destinations to Delhi & Chandigarh</div>
                  </li>
                  <li className="flex items-start gap-4">
                    <FaCheckCircle className="text-green-600 text-3xl mt-1 flex-shrink-0" />
                    <div><strong>Comfortable AC Buses</strong><br />Modern fleet with reclining seats & climate control</div>
                  </li>
                  <li className="flex items-start gap-4">
                    <FaCheckCircle className="text-green-600 text-3xl mt-1 flex-shrink-0" />
                    <div><strong>Mountain-Experienced Drivers</strong><br />Years of safe Himalayan road experience</div>
                  </li>
                  <li className="flex items-start gap-4">
                    <FaCheckCircle className="text-green-600 text-3xl mt-1 flex-shrink-0" />
                    <div><strong>Real-time Tracking</strong><br />GPS with live updates via SMS & email</div>
                  </li>
                  <li className="flex items-start gap-4">
                    <FaCheckCircle className="text-green-600 text-3xl mt-1 flex-shrink-0" />
                    <div><strong>24/7 Support</strong><br />Round-the-clock assistance for bookings & travel</div>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-8">Available Routes</h3>
                <div className="space-y-6">
                  {routes.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No routes loaded yet.</p>
                  ) : (
                    routes.slice(0, 4).map((route) => (
                      <div
                        key={route._id}
                        className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0 cursor-pointer hover:bg-gray-100 px-4 -mx-4 rounded transition"
                        onClick={() => (window.location.href = `/buses?routeId=${route._id}`)}
                      >
                        <div>
                          <div className="font-medium">
                            {capitalizeCity(route.source)} → {capitalizeCity(route.destination)}
                          </div>
                          <div className="text-sm text-gray-500">{formatDuration(route.time)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">Prices vary</div>
                          <div className="text-xs text-gray-500">Check availability</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}