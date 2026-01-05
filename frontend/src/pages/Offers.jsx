// src/pages/Offers.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCopy, 
  FaCheckCircle, 
  FaTag, 
  FaUserPlus, 
  FaGraduationCap, 
  FaCalendarWeek, 
  FaSnowflake 
} from 'react-icons/fa';
import { offers } from '../assets/routesData'; // Now importing from routesData.js

const filterTabs = [
  { name: 'All Offers', icon: FaTag },
  { name: 'New Users', icon: FaUserPlus },
  { name: 'Students', icon: FaGraduationCap },
  { name: 'Weekend', icon: FaCalendarWeek },
  { name: 'Seasonal', icon: FaSnowflake },
];

export default function Offers() {
  const [activeFilter, setActiveFilter] = useState('All Offers');
  const [copiedCode, setCopiedCode] = useState('');

  const filteredOffers = activeFilter === 'All Offers'
    ? offers
    : offers.filter(offer => offer.category === activeFilter);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-30 border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium text-lg group">
            <FaArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Exclusive Offers
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Special Deals & Discounts
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Save more on your journey with our exclusive offers and promo codes
          </p>
        </div>

        {/* Filter Tabs with React Icons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveFilter(tab.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeFilter === tab.name
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className="text-lg" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredOffers.map((offer, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              {/* Image + Discount Badge */}
              <div className="relative h-48">
                <img
                  src={offer.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&q=80'}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                  {offer.discount}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-gray-600 mb-6">{offer.subtitle}</p>

                {/* Promo Code Box */}
                <div className="bg-gray-100 rounded-lg p-4 mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Promo Code</p>
                    <p className="text-xl font-bold text-gray-800">{offer.code}</p>
                    <p className="text-xs text-gray-500 mt-1">Until {offer.validUntil}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {copiedCode === offer.code ? <FaCheckCircle /> : <FaCopy />}
                  </button>
                </div>

                {/* Min / Max Save */}
                <div className="flex justify-between text-sm mb-6">
                  <div className="text-center">
                    <p className="text-gray-600">Min:</p>
                    <p className="font-bold text-gray-900">₹{offer.minAmount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Max Save:</p>
                    <p className="font-bold text-green-600">₹{offer.maxSave}</p>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-700 mb-3">Terms & Conditions</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {offer.terms.map((term, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How to Use Promo Codes */}
        <div className="bg-green-600 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-10">How to Use Promo Codes</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="w-16 h-16 bg-white text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <p className="text-xl font-medium">Copy your preferred promo code</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <p className="text-xl font-medium">Select your bus and seats</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <p className="text-xl font-medium">Apply code at checkout and save!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}