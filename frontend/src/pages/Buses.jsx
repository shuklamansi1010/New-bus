import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Buses = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchBuses = async () => {
      if (!from || !to) return;

      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get(`${backendUrl}/api/user/buses`, {
          params: { from, to, date: new Date().toISOString().split('T')[0] },
        });

        if (data.success) {
          setBuses(data.buses || []);
        } else {
          setError('No buses found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch buses');
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [from, to, backendUrl]);

  if (loading) return <p className="text-center py-20">Loading buses...</p>;
  if (error) return <p className="text-center py-20 text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-3xl font-bold mb-6">
        Buses from {from} → {to}
      </h2>
      {buses.length === 0 ? (
        <p>No buses available for this route.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {buses.map((bus) => (
            <div
              key={bus._id}
              className="border p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="font-bold text-lg">{bus.name || 'Bus Name'}</h3>
              <p>{bus.routeId?.source} → {bus.routeId?.destination}</p>
              <p>Seats Available: {bus.seats.filter(s => !s.isBooked).length}</p>
              <p>Price: ₹{bus.seats[0]?.price || 'Varies'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Buses;
