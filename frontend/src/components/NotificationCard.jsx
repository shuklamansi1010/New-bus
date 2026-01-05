import React, { useEffect, useState, useCallback } from "react";

// --- Constants for Circular Progress Bar (SVG) ---
const RADIUS = 60;
const STROKE = 8
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Helper to calculate the stroke-dashoffset based on progress
const getDashoffset = (progress) => {
  return CIRCUMFERENCE * (1 - progress / 100);
};

// ... (rest of the component logic remains the same) ...

const NotificationCard = ({ 
  type = "success", 
  message = "Operation completed successfully.", 
  title, 
  onClose, 
  duration = 4000 
}) => {
  const [progress, setProgress] = useState(0);

  // --- Theme Definitions ---
  const themeStyles = {
    success: {
      color: "text-green-600",
      ringColor: "stroke-green-500",
      icon: "✔",
      defaultTitle: "Success!",
    },
    error: {
      color: "text-red-600",
      ringColor: "stroke-red-500",
      icon: "✖",
      defaultTitle: "Error!",
    },
    info: {
      color: "text-blue-600",
      ringColor: "stroke-blue-500",
      icon: "ℹ",
      defaultTitle: "Information",
    },
    warning: {
      color: "text-yellow-600",
      ringColor: "stroke-yellow-500",
      icon: "⚠",
      defaultTitle: "Warning!",
    },
  };

  const currentTheme = themeStyles[type] || themeStyles.info;
  const displayTitle = title || currentTheme.defaultTitle;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    // 1. Auto close timer
    const timer = setTimeout(handleClose, duration);

    // 2. Progress animation (0-100% for progress state)
    let start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = Math.min((elapsed / duration) * 100, 100);
      setProgress(percentage);
      
      if (percentage >= 100) {
        clearInterval(interval);
      }
    }, 16);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, handleClose]);

  const center = RADIUS + STROKE / 2;
  const viewBoxSize = RADIUS * 2 + STROKE;


  return (
    <>
      {/* 1. Blur background overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300" 
        onClick={handleClose}
      />

      {/* 2. Centered Card Container (Adjusted Width) */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        {/* CHANGED: max-w-sm to max-w-md for increased width */}
        <div className="relative w-100 max-w-m  bg-white rounded-2xl shadow-2xl p-8 transform scale-100 transition-all duration-300 ease-in-out">
          
          {/* Close Button */}
          <button 
            onClick={handleClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Close notification"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          {/* Icon and Circular Progress Bar */}
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="relative" style={{ width: viewBoxSize, height: viewBoxSize }}>
              
              {/* SVG Container */}
              <svg 
                className="transform -rotate-90" 
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
              >
                {/* Background Ring (Gray) */}
                <circle
                  className="stroke-gray-200"
                  strokeWidth={STROKE}
                  fill="transparent"
                  r={RADIUS}
                  cx={center}
                  cy={center}
                />
                
                {/* Foreground Progress Ring (Colorized) */}
                <circle
                  className={`${currentTheme.ringColor} transition-stroke-dashoffset duration-[16ms] ease-linear`}
                  strokeWidth={STROKE}
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={getDashoffset(progress)}
                  fill="transparent"
                  r={RADIUS}
                  cx={center}
                  cy={center}
                  strokeLinecap="round"
                />
              </svg>

              {/* Icon/Text in the Center of the Circle */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className={`text-5xl font-extrabold ${currentTheme.color}`}>
                  {currentTheme.icon}
                </p>
              </div>

            </div>
            
            {/* Countdown Text
            <p className="text-sm text-gray-500 font-medium">
                Closing in {Math.ceil((duration * (100 - progress) / 100) / 1000)}s
            </p> */}

          </div>

          {/* Title & Message */}
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-2 ${currentTheme.color}`}>{displayTitle}</h2>
            <p className="text-gray-700 text-base">{message}</p>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default NotificationCard;