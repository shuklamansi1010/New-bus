import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

const BookingCard = ({ booking }) => {
  const { cancelBooking } = useContext(AdminContext);

  return (
    <div style={{ border: "1px solid gray", margin: "5px", padding: "5px" }}>
      <p>Bus: {booking.busId.name}</p>
      <p>Route: {booking.routeId.from} → {booking.routeId.to}</p>
      <p>Seat: {booking.seatNo}</p>
      <p>User: {booking.userId.name}</p>
      <button onClick={() => cancelBooking(booking._id)}>Cancel Booking</button>
    </div>
  );
};

export default BookingCard;
