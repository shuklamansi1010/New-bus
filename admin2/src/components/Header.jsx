import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
// ✅ Importing Lucide Icons
import { LogOut, LogIn, LayoutDashboard, ShieldCheck } from 'lucide-react';

const Header = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAToken(''); // Clear admin token from context
    localStorage.removeItem('aToken'); // Clear token from localStorage
    navigate('/login'); // Redirect to login page
  };

  const handleLogin = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200 shadow-sm">
      {/* Brand / Title Section */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Admin Portal</h1>
          {aToken && (
             <p className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
               <ShieldCheck size={10} /> Verified Session
             </p>
          )}
        </div>
      </div>

      {/* Auth Action Section */}
      <div className="flex items-center gap-4">
        {aToken ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-50 text-rose-600 px-5 py-2.5 rounded-xl font-bold hover:bg-rose-100 transition-all border border-rose-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
          >
            <LogIn size={18} />
            Admin Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;