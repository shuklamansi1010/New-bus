import React, { useEffect, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import BookingCard from "../components/BookingCard";

const Bookings = () => {
  const { bookings, getAllBookings } = useContext(AdminContext);

  useEffect(() => {
    getAllBookings();
  }, []);

  return (
    <div>
      <h1>Bookings</h1>
      {bookings.map(b => (
        <BookingCard key={b._id} booking={b} />
      ))}
    </div>
  );
};

export default Bookings;
