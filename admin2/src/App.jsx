import React, { useContext } from 'react';
import { AdminContext } from "./context/AdminContext";
import { AppContext } from "./context/AppContext";
import { Route, Routes, Navigate } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import AddRoute from './pages/AddRoute';
import Login from './pages/Login';

// Notification Component
import NotificationCard from "./components/NotificationCard";
import AddBus from './pages/AddBus';

const App = () => {
    const { aToken } = useContext(AdminContext);
    const { notification, hideNotification } = useContext(AppContext);

    // --------------------------
    // If NO admin token → show login
    // --------------------------
    if (!aToken) {
        return (
            <>
                <ToastContainer 
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <Login />

                {/* Show notification on login */}
                {notification && (
                    <NotificationCard
                        type={notification.type}
                        title={notification.title}
                        message={notification.message}
                        onClose={hideNotification}
                    />
                )}
            </>
        );
    }

    return (
        <div className="bg-[#F8F9FD] min-h-screen">
            <ToastContainer 
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Global Notification */}
            {notification && (
                <NotificationCard
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    onClose={hideNotification}
                />
            )}

            <Navbar />
            {/* The main layout container is fixed here */}
            <div className='flex items-start'>
                <Sidebar />
                
                {/* FIX: This div wraps the Routes.
                  'flex-1' ensures it takes up all remaining horizontal space next to the Sidebar.
                  'p-6' adds essential padding for the page content.
                */}
                <div className="flex-1 p-6">
                    <Routes>
                        {/* Admin Routes */}
                        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/admin/bookings" element={<Bookings />} />
                        <Route path="/admin/add-route" element={<AddRoute />} />
                        <Route path="/admin/add-bus" element={<AddBus />} />

                        {/* Catch-all redirect */}
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default App;