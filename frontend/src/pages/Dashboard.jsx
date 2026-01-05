// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// // Assume you have an API base URL in env
// const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const [routes, setRoutes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Form state for adding new route
//   const [newRoute, setNewRoute] = useState({
//     source: "",
//     destination: "",
//     distance: "",
//     time: "", // e.g., "12h 30m"
//     stops: "", // comma-separated
//   });

//   const [adding, setAdding] = useState(false);

//   // Fetch all routes on mount
//   useEffect(() => {
//     const fetchRoutes = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const { data } = await axios.get(`${API_BASE}/api/admin/routes`, {
//           headers: {
//             aToken: localStorage.getItem("aToken") || "",
//           },
//         });

//         if (data.success) {
//           setRoutes(data.routes || []);
//         } else {
//           setError(data.message || "Failed to load routes");
//         }
//       } catch (err) {
//         console.error("Fetch routes error:", err);
//         setError(
//           err.response?.data?.message || "Unable to connect to server. Check your connection."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoutes();
//   }, []);

//   // Add new route
//   const handleAddRoute = async () => {
//     // Validation
//     if (!newRoute.source.trim() || !newRoute.destination.trim()) {
//       alert("Source and Destination are required!");
//       return;
//     }

//     if (newRoute.source.trim().toLowerCase() === newRoute.destination.trim().toLowerCase()) {
//       alert("Source and Destination cannot be the same!");
//       return;
//     }

//     try {
//       setAdding(true);

//       const routeData = {
//         source: newRoute.source.trim(),
//         destination: newRoute.destination.trim(),
//         distance: newRoute.distance ? Number(newRoute.distance) : undefined,
//         time: newRoute.time.trim() || undefined,
//         stops: newRoute.stops
//           ? newRoute.stops
//               .split(",")
//               .map((s) => s.trim())
//               .filter((s) => s)
//           : [],
//       };

//       const { data } = await axios.post(
//         `${API_BASE}/api/admin/add-route`,
//         routeData,
//         {
//           headers: {
//             aToken: localStorage.getItem("aToken") || "",
//           },
//         }
//       );

//       if (data.success) {
//         setRoutes([...routes, data.route]);
//         // Reset form
//         setNewRoute({ source: "", destination: "", distance: "", time: "", stops: "" });
//         alert("Route added successfully! 🎉");
//       } else {
//         alert(data.message || "Failed to add route");
//       }
//     } catch (err) {
//       console.error("Add route error:", err);
//       alert(
//         err.response?.data?.message || "Failed to add route. Please try again."
//       );
//     } finally {
//       setAdding(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="mb-10">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
//           <p className="text-gray-600">Manage bus routes for your booking platform</p>
//         </div>

//         {/* Add New Route Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Route</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Source City <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={newRoute.source}
//                 onChange={(e) =>
//                   setNewRoute({ ...newRoute, source: e.target.value })
//                 }
//                 placeholder="e.g., Manali"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Destination City <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={newRoute.destination}
//                 onChange={(e) =>
//                   setNewRoute({ ...newRoute, destination: e.target.value })
//                 }
//                 placeholder="e.g., Delhi"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Distance (km)
//               </label>
//               <input
//                 type="number"
//                 value={newRoute.distance}
//                 onChange={(e) =>
//                   setNewRoute({ ...newRoute, distance: e.target.value })
//                 }
//                 placeholder="e.g., 550"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Estimated Time
//               </label>
//               <input
//                 type="text"
//                 value={newRoute.time}
//                 onChange={(e) =>
//                   setNewRoute({ ...newRoute, time: e.target.value })
//                 }
//                 placeholder="e.g., 12h 30m"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Intermediate Stops (comma separated)
//               </label>
//               <input
//                 type="text"
//                 value={newRoute.stops}
//                 onChange={(e) =>
//                   setNewRoute({ ...newRoute, stops: e.target.value })
//                 }
//                 placeholder="e.g., Mandi, Bilaspur, Chandigarh"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//           </div>

//           <button
//             onClick={handleAddRoute}
//             disabled={adding}
//             className="mt-8 px-10 py-4 bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
//           >
//             {adding ? "Adding Route..." : "Add Route"}
//           </button>
//         </div>

//         {/* Routes List */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           <div className="px-8 py-6 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-800">All Routes ({routes.length})</h2>
//           </div>

//           {loading ? (
//             <div className="p-12 text-center">
//               <p className="text-gray-500 text-lg">Loading routes...</p>
//             </div>
//           ) : error ? (
//             <div className="p-12 text-center">
//               <p className="text-red-600 font-medium">{error}</p>
//             </div>
//           ) : routes.length === 0 ? (
//             <div className="p-12 text-center">
//               <p className="text-gray-500 text-lg">No routes added yet. Create your first one above!</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-200">
//               {routes.map((route) => (
//                 <div
//                   key={route._id}
//                   className="px-8 py-6 hover:bg-gray-50 transition"
//                 >
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800">
//                         {route.source} → {route.destination}
//                       </h3>
//                       <div className="text-gray-600 mt-2 space-y-1">
//                         {route.distance && <p>Distance: {route.distance} km</p>}
//                         {route.time && <p>Duration: {route.time}</p>}
//                         {route.stops && route.stops.length > 0 && (
//                           <p>Stops: {route.stops.join(" → ")}</p>
//                         )}
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => navigate(`/admin/buses?route=${route._id}`)}
//                       className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
//                     >
//                       Manage Buses
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;