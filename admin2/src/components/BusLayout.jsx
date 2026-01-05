import React, { useState } from "react";
// Import necessary icons from Font Awesome (fa)
import { FaChair, FaBed, FaBus } from 'react-icons/fa'; 
// NOTE: GiSteeringWheel import was removed as it requires the 'gi' package/setup 
// which was causing the original error.

const SEAT_STATUS = {
    AVAILABLE: "available",
    BOOKED: "booked",
    SELECTED: "selected",
};

// --- DATA STRUCTURES (Used for initialization and reference) ---

const getSeatData = (seat, defaultPrice, defaultType) => {
    if (typeof seat === "string") {
        return { label: seat, status: SEAT_STATUS.AVAILABLE, price: defaultPrice, type: defaultType };
    }
    return { label: seat.label, status: SEAT_STATUS.AVAILABLE, price: defaultPrice, type: defaultType, ...seat };
};

const seaterLayoutData = [
    ["1A", "1B", null, "1C", "1D"],
    ["2A", "2B", null, "2C", "2D"],
    ["3A", "3B", null, { label: "3C", status: SEAT_STATUS.BOOKED }, "3D"],
    ["4A", { label: "4B", status: SEAT_STATUS.BOOKED }, null, "4C", "4D"],
    ["5A", "5B", null, "5C", "5D"],
    ["6A", "6B", null, "6C", "6D"],
    ["7A", "7B", null, "7C", "7D"],
    ["8A", "8B", "8C", "8D", "8E"],
];

const sleeperLayoutData = {
    lower: [
        [{ label: "L1", type: "sleeper", price: 1200 }, null, { label: "L2", type: "sleeper", price: 1200 }],
        [{ label: "L3", type: "sleeper", price: 1200, status: SEAT_STATUS.BOOKED }, null, { label: "L4", type: "sleeper", price: 1200 }],
        [{ label: "L5", type: "sleeper", price: 1200 }, null, { label: "L6", type: "sleeper", price: 1200, status: SEAT_STATUS.BOOKED }],
        [{ label: "L7", type: "sleeper", price: 1200 }, null, { label: "L8", type: "sleeper", price: 1200 }],
        [{ label: "L9", type: "sleeper", price: 1200 }, null, { label: "L10", type: "sleeper", price: 1200 }],
        [{ label: "L11", type: "sleeper", price: 1200 }, null, { label: "L12", type: "sleeper", price: 1200 }],
    ],
    upper: [
        [{ label: "U1", type: "sleeper", price: 1250 }, null, { label: "U2", type: "sleeper", price: 1250, status: SEAT_STATUS.BOOKED }],
        [{ label: "U3", type: "sleeper", price: 1250 }, null, { label: "U4", type: "sleeper", price: 1250 }],
        [{ label: "U5", type: "sleeper", price: 1250 }, null, { label: "U6", type: "sleeper", price: 1250 }],
        [{ label: "U7", type: "sleeper", price: 1250 }, null, { label: "U8", type: "sleeper", price: 1250 }],
        [{ label: "U9", type: "sleeper", price: 1250, status: SEAT_STATUS.BOOKED }, null, { label: "U10", type: "sleeper", price: 1250 }],
        [{ label: "U11", type: "sleeper", price: 1250 }, null, { label: "U12", type: "sleeper", price: 1250 }],
    ]
};

const semiSleeperLayoutData = [
    // Seater Rows (2+2 configuration)
    [{ label: "L1A", price: 550, type: "seater" }, { label: "L1B", price: 550, type: "seater" }, null, { label: "L1C", price: 550, type: "seater" }, { label: "L1D", price: 550, type: "seater" }],
    [{ label: "L2A", price: 550, type: "seater" }, { label: "L2B", price: 550, type: "seater" }, null, { label: "L2C", price: 550, status: SEAT_STATUS.BOOKED, type: "seater" }, { label: "L2D", price: 550, type: "seater" }],
    // Semi-Sleeper Berths (2+1 configuration)
    [{ label: "S3A", type: "semi-sleeper", price: 900 }, { label: "S3B", type: "semi-sleeper", price: 900 }, null, { label: "S3C", type: "semi-sleeper", price: 900 }],
    [{ label: "S4A", type: "semi-sleeper", price: 900, status: SEAT_STATUS.BOOKED }, { label: "S4B", type: "semi-sleeper", price: 900 }, null, { label: "S4C", type: "semi-sleeper", price: 900 }],
    [{ label: "S5A", type: "semi-sleeper", price: 900 }, { label: "S5B", type: "semi-sleeper", price: 900 }, null, { label: "S5C", type: "semi-sleeper", price: 900 }],
    [{ label: "S6A", type: "semi-sleeper", price: 900 }, { label: "S6B", type: "semi-sleeper", price: 900 }, null, { label: "S6C", type: "semi-sleeper", price: 900 }],
    [{ label: "S7A", type: "semi-sleeper", price: 900 }, { label: "S7B", type: "semi-sleeper", price: 900 }, null, { label: "S7C", type: "semi-sleeper", price: 900 }],
];


// --- COMPONENT START ---

const BusLayout = ({ type = "seater", className = "" }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    
    // Check if the seat is already selected or book and toggle selection
    const handleSeatClick = (seatLabel, status) => {
        if (status === SEAT_STATUS.BOOKED) return;

        setSelectedSeats((prev) => {
            return prev.includes(seatLabel)
                ? prev.filter((s) => s !== seatLabel)
                : [...prev, seatLabel];
        });
    };

    // Determine Tailwind classes based on seat status
    const getStatusClass = (label, status) => {
        const isSelected = selectedSeats.includes(label);
        const effectiveStatus = isSelected ? SEAT_STATUS.SELECTED : status;

        switch (effectiveStatus) {
            case SEAT_STATUS.BOOKED:
                return "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed shadow-inner";
            case SEAT_STATUS.SELECTED:
                // Use a bolder blue look for selection
                return "bg-sky-100 border-sky-600 text-sky-800 shadow-xl ring-2 ring-sky-400 transform scale-[1.05]";
            case SEAT_STATUS.AVAILABLE:
            default:
                // Use a primary green brand color for available seats
                return "bg-white border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 shadow-sm";
        }
    };

    // --- SEAT/BERTH RENDERER (Universal function) ---
    const renderSeat = (seat) => {
        if (!seat) return null;

        const defaultType = seat.type || 'seater';
        const defaultPrice = seat.price || (defaultType === 'sleeper' ? 1200 : 584);
        const data = getSeatData(seat, defaultPrice, defaultType); 
        
        const { label, status, price, type: seatType } = data;
        
        const statusClass = getStatusClass(label, status);
        const isSleeper = seatType === "sleeper";
        const isSemiSleeper = seatType === "semi-sleeper";
        const isSeater = !isSleeper && !isSemiSleeper;
        const isBooked = status === SEAT_STATUS.BOOKED;
        const isSelected = selectedSeats.includes(label);
        
        // Determine base size and shape
        let baseClasses = "";
        let IconComponent;
        let iconSize;
        
        if (isSleeper) {
            baseClasses = "h-24 w-12 rounded-lg";
            IconComponent = FaBed;
            iconSize = 30;
        } else if (isSemiSleeper) {
            baseClasses = "h-20 w-12 rounded-lg";
            IconComponent = FaBed;
            iconSize = 24;
        } else { 
            baseClasses = "h-12 w-12 rounded-lg";
            IconComponent = FaChair;
            iconSize = 20;
        }

        const priceText = isBooked ? "Sold" : `₹${price}`;
        const priceClass = isBooked ? 'text-gray-500 font-medium' : 'text-slate-800 font-bold';
        
        const iconColor = isBooked ? 'text-gray-500' : isSelected ? 'text-sky-700' : 'text-green-600';
        
        // Icon rendering
        const innerIcon = (
            <IconComponent className={`${iconColor} transition-colors`} size={iconSize} />
        );

        return (
            <div key={label} className="flex flex-col items-center justify-start py-1">
                <button
                    type="button"
                    onClick={() => handleSeatClick(label, status)}
                    disabled={isBooked}
                    className={[
                        "relative flex items-center justify-center transition-all duration-200 border-2",
                        baseClasses,
                        statusClass,
                        isBooked ? "hover:scale-100" : "hover:scale-[1.02] active:scale-[0.98]",
                    ].filter(Boolean).join(" ")}
                >
                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {innerIcon}
                    </div>
                    
                    {/* Label Overlay */}
                    <span className={`absolute font-extrabold ${isSeater ? 'bottom-1 text-[10px]' : 'bottom-2 text-xs'} ${isBooked ? 'text-gray-600' : 'text-slate-900'}`}>
                        {label}
                    </span>
                </button>
                
                {/* Price/Status Text below the seat */}
                <span className={`text-xs mt-1 ${priceClass}`}>
                    {priceText}
                </span>
            </div>
        );
    };
    
    // --- LAYOUT RENDERER ---
    const renderLayout = (data, isDoubleDecker = false) => {
        // Calculate grid template based on the first row to handle aisles (null = 24px)
        const gridTemplate = data[0].map(item => item === null ? '24px' : 'minmax(0, 1fr)').join(' ');
        
        // Determine the height of the aisle columns based on the tallest item (sleeper berths are tallest)
        const maxItemHeightClass = data.flat().some(item => item && item.type === 'sleeper') ? 'h-28' : 'h-20'; 

        return (
            <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-inner border border-gray-200">
                
                {/* Bus Front/Driver */}
                {!isDoubleDecker && (
                    <div className="flex items-center justify-between w-full mb-4 px-4">
                        <div className="w-10 h-10 flex items-center justify-center text-xl text-gray-400">
                            {/* Using rotated FaChair for the driver's seat */}
                            <FaChair className="transform rotate-90" size={20} />
                        </div>
                        <div className="text-sm font-semibold text-slate-600">Front</div>
                        <div className="w-10 h-10 flex items-center justify-center text-xl text-gray-400">
                            {/* Using FaBus to represent the door/front of the bus */}
                            <FaBus size={20} /> 
                        </div>
                    </div>
                )}
                
                {/* Seats Grid */}
                <div 
                    className="w-full gap-x-2 gap-y-2" 
                    style={{ display: 'grid', gridTemplateColumns: gridTemplate }}
                >
                    {data.flat().map((seat, index) => (
                        seat === null 
                            // Aisle cell must match the height of the seats next to it
                            ? <div key={index} className={`h-full ${maxItemHeightClass}`} /> 
                            : renderSeat(seat) 
                    ))}
                </div>
            </div>
        );
    };

    // --- MAIN RENDER LOGIC ---

    let layoutContent;
    let layoutTitle;

    if (type === "sleeper") {
        layoutTitle = "Double Decker Sleeper (1+1 Berths)";
        layoutContent = (
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl mx-auto">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 text-center">Lower Deck (Sleeper)</h3>
                    {renderLayout(sleeperLayoutData.lower, true)}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 text-center">Upper Deck (Sleeper)</h3>
                    {renderLayout(sleeperLayoutData.upper, true)}
                </div>
            </div>
        );
    } else if (type === "semi-sleeper") {
        layoutTitle = "Semi-Sleeper Coach (Mixed Seater/Berth)";
        layoutContent = (
            <div className="w-full max-w-lg mx-auto">
                <div className="text-sm text-center font-semibold text-slate-700 mb-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                    Front 2 rows are **Seater** ($\text{2+2}$), rest are **Semi-Sleeper Berths** ($\text{2+1}$)
                </div>
                {renderLayout(semiSleeperLayoutData)}
            </div>
        );
    } else { // default: seater
        layoutTitle = "AC Seater Coach (2+2)";
        layoutContent = (
            <div className="w-full max-w-md mx-auto">
                {renderLayout(seaterLayoutData)}
            </div>
        );
    }

    // --- FINAL CONTAINER ---
    return (
        <div className={`w-full mx-auto p-6 bg-gray-50 rounded-3xl shadow-2xl ${className}`}>
            
            <h2 className="text-3xl font-black text-slate-900 text-center mb-6">{layoutTitle}</h2>
            
            {/* Selection Status & Booking Button */}
            <div className="flex justify-center mb-6">
                <div className="inline-flex items-center space-x-4 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100">
                    <span className="text-lg font-semibold text-sky-700">
                        Total Selected: {selectedSeats.length} 
                    </span>
                    {selectedSeats.length > 0 && (
                        <button className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full hover:bg-red-600 transition">
                            Book {selectedSeats.length} Seats
                        </button>
                    )}
                </div>
            </div>

            {layoutContent}

            {/* Legend */}
            <div className="mt-8 pt-4 border-t-2 border-gray-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Seat Status Legend</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                    
                    {/* Available Seat */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-white border-2 border-green-500 rounded-lg flex items-center justify-center">
                            <FaChair className="text-green-600" size={20} />
                        </div>
                        <span className="text-sm font-medium text-green-700">Available Seat</span>
                    </div>

                    {/* Available Semi-Sleeper (Higher box to represent Berth) */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-20 bg-white border-2 border-green-500 rounded-lg flex items-center justify-center">
                            <FaBed className="text-green-600" size={24} />
                        </div>
                        <span className="text-sm font-medium text-green-700">Available Berth</span>
                    </div>

                    {/* Selected */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-sky-100 border-2 border-sky-600 rounded-lg ring-2 ring-sky-400 flex items-center justify-center">
                            <FaChair className="text-sky-700" size={20} />
                        </div>
                        <span className="text-sm font-medium text-sky-800">Selected</span>
                    </div>
                    
                    {/* Sold */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-200 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                            <FaChair className="text-gray-500" size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Sold (Booked)</span>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default BusLayout;