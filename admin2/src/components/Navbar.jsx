import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { AppContext } from "../context/AppContext";
// ✅ Importing Lucide Icons
import { LogOut, UserCircle, ShieldCheck, User } from "lucide-react";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { userToken, setUserToken } = useContext(AppContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");

    if (userToken) {
      setUserToken("");
      localStorage.removeItem("userToken");
    }

    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
  };

  return (
    <nav className="flex justify-between items-center h-20 px-6 sm:px-12 py-2 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      {/* Logo + Role Badge */}
      <div className="flex items-center gap-4">
        <img
          onClick={() => navigate("/")}
          className="w-32 sm:w-36 cursor-pointer hover:opacity-80 transition-opacity"
          src={assets.logo1}
          alt="Logo"
        />
        
        {/* Role Badge with Icon */}
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
          aToken 
            ? "border-indigo-200 bg-indigo-50 text-indigo-700" 
            : userToken 
            ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
            : "border-gray-200 bg-gray-50 text-gray-500"
        }`}>
          {aToken ? <ShieldCheck size={12} /> : <User size={12} />}
          {aToken ? "Admin" : userToken ? "User" : "Guest"}
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {(aToken || userToken) ? (
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Profile Greeting (Visible on desktop) */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Current Session</span>
              <span className="text-sm font-bold text-gray-700">
                {aToken ? "Administrator" : "User Account"}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-slate-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          /* Login Shortcut if no tokens */
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-gray-600 font-bold hover:text-indigo-600 transition-colors"
          >
            <UserCircle size={20} />
            <span className="text-sm">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;