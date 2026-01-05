// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import SearchBuses from "./pages/SearchBuses.jsx";
import BusList from "./pages/BusList.jsx";
import BusDetails from "./pages/BusDetails.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import BusRoutes from "./pages/BusRoutes.jsx";
// import Payment from "./pages/Payment.jsx";
import BookBus from "./pages/BookBus.jsx"; 
import Buses from "./pages/Buses.jsx";
import Offers from "./pages/Offers.jsx";
import MyProfile from "./pages/MyProfile.jsx";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <>
      <ScrollToTop />

      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/offers" element={<Offers/>} />
            <Route path="/my-profile" element={<MyProfile/>} />
            {/* Bus Booking Flow */}
            <Route path="/search" element={<SearchBuses />} />
            <Route path="/buses" element={<BusList />} />
            <Route path="/bus/:busId" element={<BusDetails />} />
            <Route path="/routes" element={<BusRoutes />} />
            
            {/* ← FIXED: Consistent route path */}
            <Route path="/bookbus/:busId" element={<BookBus />} />

            {/* <Route path="/payment/:bookingId" element={<Payment />} /> */}

            {/* Protected User Routes */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            {/* 404 - Page Not Found */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                  <div className="text-center">
                    <h1 className="text-8xl font-black text-gray-200 mb-4">404</h1>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Oops! Page Not Found
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                      The page you're looking for doesn't exist or has been moved.
                    </p>
                    <button
                      onClick={() => window.history.back()}
                      className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg transition"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default App;