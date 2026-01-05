import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    FaHome,
    FaBus,
    FaPlusCircle,
    FaRoute,
    FaTicketAlt,
    FaSignOutAlt,
    FaBars,
    FaTimes,
} from "react-icons/fa";

// Define the width constant for consistency
const SIDEBAR_WIDTH_CLASS = "w-64"; 

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // Updated menu items for bus booking admin
    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: FaHome },
        { name: "Add Bus", path: "/admin/add-bus", icon: FaPlusCircle },
        { name: "Add Route", path: "/admin/add-route", icon: FaRoute },
        { name: "Bookings", path: "/admin/bookings", icon: FaTicketAlt },
    ];

    const handleLogout = () => {
        // Assuming AdminContext is needed here, but using raw localStorage for simplicity as in original code
        localStorage.removeItem("aToken"); 
        toast.success("Logged out successfully");
        navigate("/"); // redirect to login
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={toggleMenu}
                // NOTE: Consider placing the button within the fixed Navbar if one exists, 
                // but keeping it here as per original code structure.
                className="fixed top-4 left-4 z-50 lg:hidden bg-primary text-white p-3 rounded-lg shadow-lg hover:bg-primary/90 transition"
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* FIX 1: Static Spacer for Main Content Flow
              This element takes up physical space (w-64) in the document flow 
              on large screens (lg:block), pushing the main content to the right. 
              It is hidden on mobile screens to allow the content to use full width.
            */}
            <div className={`hidden lg:block ${SIDEBAR_WIDTH_CLASS} flex-shrink-0`} aria-hidden="true" />


            {/* Sidebar (Fixed position for actual navigation panel) */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 ${SIDEBAR_WIDTH_CLASS} bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo & Title */}
                    <div className="p-6 border-b border-gray-800">
                        <div className="flex items-center space-x-3">
                            {/* Assuming 'bg-primary' is defined in your CSS */}
                            <div className="bg-primary p-3 rounded-lg"> 
                                <FaBus size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Bus Admin</h1>
                                <p className="text-gray-400 text-sm">Management Panel</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.name}>
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsOpen(false)} // Close on mobile
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                                                isActive
                                                    ? "bg-primary text-white shadow-lg"
                                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                            }`}
                                        >
                                            <item.icon size={20} />
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition"
                        >
                            <FaSignOutAlt size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile (Required when the fixed menu is open) */}
            {isOpen && (
                <div
                    onClick={toggleMenu}
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                />
            )}
        </>
    );
};

export default Sidebar;