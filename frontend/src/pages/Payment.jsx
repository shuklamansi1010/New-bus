
import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api.jsx";

const Payment = () => {
  const { tripId } = useParams();
  const [utr, setUtr] = useState("");

  const handlePayment = async () => {
    await API.post("/payments", { trip: tripId, utr });
    alert("Payment submitted!");
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Payment</h2>
      <input placeholder="Enter UTR / Reference Number" value={utr} onChange={e=>setUtr(e.target.value)} className="border p-2 w-full mb-2"/>
      <button onClick={handlePayment} className="bg-green-500 text-white px-4 py-2 rounded">Confirm Payment</button>
    </div>
  );
};

export default Payment;
