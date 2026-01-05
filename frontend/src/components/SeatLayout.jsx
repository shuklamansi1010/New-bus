import React, { useCallback, useMemo, useState } from "react";
import {
  FaBed, FaChair, FaStar, FaVenusMars, FaWindowMaximize, FaRoad,
  FaTimes, FaUserSlash, FaBus, FaCircle
} from "react-icons/fa";

export const MAX_SEATS = 6;

// ---------------------- UltimateSeat Component ----------------------
const UltimateSeat = ({ seat, selectedSeats, onSeatClick, isUpperDeck = false }) => {
  const isSelected = selectedSeats.includes(seat.seatNumber);
  const isBooked = seat.isBooked;

  const getDimensions = () => {
    if (seat.type === "sleeper") {
      // Sleepers are horizontal rectangles (wider for doubles, but here uniform)
      return "w-15 h-30"; // Wider than tall to represent horizontal berth
    }
    return "w-15 h-15";
  };

  const getSeatStyle = () => {
    const base = `group ${getDimensions()} rounded-lg shadow-md border-2 cursor-pointer relative transition-all duration-300 hover:shadow-lg active:scale-95 font-medium flex flex-col items-center justify-center p-1`;
    if (isBooked) {
      return `${base} bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300`;
    }
    if (isSelected) {
      return `${base} bg-green-500 text-white border-green-700 ring-2 ring-green-300 scale-105 z-10`;
    }
    let bgColor = "bg-white";
    let borderColor = "border-green-400";
    let textColor = "text-green-700";
    if (seat.isWindow) {
      borderColor = "border-sky-500";
    }
    return `${base} ${bgColor} hover:bg-green-50 ${borderColor} ${textColor}`;
  };

  const BerthIcon = seat.type === "sleeper" ? FaBed : FaChair;

  return (
    <div className={getSeatStyle()} onClick={() => !isBooked && onSeatClick(seat)}>
      {isBooked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-400/70 rounded-lg">
          <div className="text-sm text-white font-bold">SOLD</div>
        </div>
      )}
      <div className="absolute top-1 left-1 text-xs text-gray-400">
        <BerthIcon />
      </div>
      <div className="absolute top-1 right-1 text-xs text-gray-400">
        {seat.isWindow && <FaWindowMaximize />}
      </div>
      <div className="text-center w-full">
        <div className="text-sm font-bold text-gray-800">{seat.seatNumber}</div>
        <div className="text-xs font-bold text-gray-600">₹{seat.price}</div>
        {seat.berth !== 'none' && (
          <div className="text-[10px] uppercase font-semibold text-green-700 mt-1">
            {seat.berth}
          </div>
        )}
      </div>
      {isSelected && (
        <div className="absolute inset-0 rounded-lg border-4 border-white/50 animate-pulse" />
      )}
    </div>
  );
};

// ---------------------- FeedbackPopup (Unchanged) ----------------------
const FeedbackPopup = ({ message, type, isVisible, onClose }) => {
  if (!isVisible) return null;
  const typeStyle = type === 'error'
    ? "bg-red-600 text-white"
    : "bg-yellow-500 text-gray-900";
  return (
    <div className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 p-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 ${typeStyle}`}>
      {type === 'error' ? <FaTimes /> : <FaUserSlash />}
      <span className="text-lg font-bold">{message}</span>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
        <FaTimes />
      </button>
    </div>
  );
};

// ---------------------- Deck Renderer Component ----------------------
const DeckRenderer = ({ title, seats, selectedSeats, onSeatClick, isUpperDeck = false }) => {
  const groupIntoRows = (seats) => {
    const rows = {};
    seats.forEach(seat => {
      const rowNum = parseInt(seat.seatNumber.match(/^\d+/)?.[0]) || 0;
      if (!rows[rowNum]) rows[rowNum] = [];
      rows[rowNum].push(seat);
    });
    const sortedRowKeys = Object.keys(rows).sort((a, b) => parseInt(a) - parseInt(b));
    return sortedRowKeys.map(key => rows[key].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber)));
  };

  const rows = groupIntoRows(seats);

  return (
    <div className="flex-1 min-w-[300px] border-l border-r border-gray-300 p-4">
      <h2 className="text-center text-xl font-bold mb-6 text-gray-800">{title}</h2>
      
      {/* Driver Icon for Lower Deck */}
      {title.includes("Lower") && (
        <div className="flex justify-end mb-4 pr-10">
          <FaCircle className="w-8 h-8 text-gray-500" />
        </div>
      )}

      <div className="space-y-8"> {/* Increased spacing between rows for better sleeper visuals */}
        {/* {rows.map((row, i) => {
          // For the desired layout: Lower deck single on left, doubles on right → 1 seat left, 2 right
          // Upper deck single on left, doubles on right → same
          // Assuming your data has 1 seat on left (A-like), 2 on right (B C or E F)
          const leftSeats = row.filter(s => ['A', 'D'].some(letter => s.seatNumber.endsWith(letter))); // Adjust letters if needed
          const rightSeats = row.filter(s => !leftSeats.includes(s)); */}

          {/* Replace the map section inside DeckRenderer with this */}
{rows.map((row, i) => {
  // Column logic: A and D are left, B, C, E, F are right
  const leftSeats = row.filter(s => ['A', 'D'].some(letter => s.seatNumber.includes(letter)));
  const rightSeats = row.filter(s => !leftSeats.includes(s));

  return (
    <div 
      key={i} 
      className="grid grid-cols-[1fr_80px_2fr] items-center mb-4" 
    >
      {/* Left side: Single berth */}
      <div className="flex justify-end pr-4"> 
        {leftSeats.map(seat => (
          <UltimateSeat
            key={seat.seatNumber}
            seat={seat}
            selectedSeats={selectedSeats}
            onSeatClick={onSeatClick}
            isUpperDeck={isUpperDeck}
          />
        ))}
      </div>

      {/* Aisle: Fixed width to act as a consistent margin */}
      <div className="flex flex-col items-center justify-center opacity-20">
        <div className="w-[2px] h-10 bg-gray-400 rounded-full mb-1"></div>
        <div className="w-[2px] h-10 bg-gray-400 rounded-full"></div>
      </div>

      {/* Right side: Double berth */}
      <div className="flex gap-4 pl-4">
        {rightSeats.map(seat => (
          <UltimateSeat
            key={seat.seatNumber}
            seat={seat}
            selectedSeats={selectedSeats}
            onSeatClick={onSeatClick}
            isUpperDeck={isUpperDeck}
          />
        ))}
      </div>
    </div>
  );
})}
    
      </div>
    </div>
  );
};

// ---------------------- Main SeatLayout Component ----------------------
const SeatLayout = ({
  bus,
  seatsData = [],
  selectedSeats = [],
  onSeatSelect
}) => {
  const [feedback, setFeedback] = useState({ message: '', type: '', isVisible: false });

  const handleSeatClick = useCallback((seat) => {
    if (seat.isBooked) {
      setFeedback({ message: `Seat ${seat.seatNumber} is already booked.`, type: 'error', isVisible: true });
      return;
    }
    const isSelected = selectedSeats.includes(seat.seatNumber);
    if (!isSelected && selectedSeats.length >= MAX_SEATS) {
      setFeedback({ message: `Maximum ${MAX_SEATS} seats allowed.`, type: 'limit', isVisible: true });
      return;
    }
    onSeatSelect(seat);
  }, [selectedSeats, onSeatSelect]);

  const closeFeedback = () => setFeedback(prev => ({ ...prev, isVisible: false }));

  const lowerDeckSeats = useMemo(() =>
    seatsData.filter(s => s.berth !== "upper"), [seatsData]
  );
  const upperDeckSeats = useMemo(() =>
    seatsData.filter(s => s.berth === "upper"), [seatsData]
  );

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, seatNo) => {
      const seat = seatsData.find(s => s.seatNumber === seatNo);
      return sum + (seat?.price || 0);
    }, 0);
  }, [selectedSeats, seatsData]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-800 mb-4">
          Select Seats
        </h1>
      </div>

      {/* Main Side-by-Side Seat Grid */}
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-5xl mx-auto flex"> {/* Wider container */}
        {/* Lower Deck */}
        <DeckRenderer
          title="Lower deck"
          seats={lowerDeckSeats}
          selectedSeats={selectedSeats}
          onSeatClick={handleSeatClick}
          isUpperDeck={false}
        />
        {/* Separator */}
        <div className="w-px bg-gray-300 mx-6"></div>
        {/* Upper Deck */}
        <DeckRenderer
          title="Upper deck"
          seats={upperDeckSeats}
          selectedSeats={selectedSeats}
          onSeatClick={handleSeatClick}
          isUpperDeck={true}
        />
      </div>

      {/* "Know your seat types" Placeholder */}
      <div className="text-center mt-8 text-lg font-bold text-gray-700">
        Know your seat types
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-100 rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-green-900 mb-6">
            {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
          </h3>
          <div className="flex flex-wrap gap-4 mb-6">
            {selectedSeats.map(seatNo => (
              <span key={seatNo} className="px-6 py-3 bg-green-600 text-white font-bold rounded-2xl shadow-lg">
                {seatNo}
              </span>
            ))}
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-green-700">
              Total: ₹{totalPrice.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Feedback */}
      <FeedbackPopup {...feedback} onClose={closeFeedback} />
    </div>
  );
};

export default SeatLayout;