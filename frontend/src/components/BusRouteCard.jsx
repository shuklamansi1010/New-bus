import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80';

const BusRouteCard = ({ from, to, duration, image }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Redirect using from/to query parameters
    navigate(`/buses?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md 
                 hover:shadow-2xl transition-all duration-300 transform 
                 hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={image || PLACEHOLDER_IMAGE}
          alt={`Bus from ${from} to ${to}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            {from} → {to}
          </h3>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {duration}
            </div>
            <span className="text-white/90 text-sm font-medium flex items-center gap-1">
              <FaClock className="text-sm" /> Direct
            </span>
          </div>
        </div>

        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white text-green-700 font-bold px-8 py-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all">
            Check Availability →
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusRouteCard;
