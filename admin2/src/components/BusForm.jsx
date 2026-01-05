// src/components/BusForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BusForm = ({ busToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    busNumber: "",
    operatorName: "",
    busType: "AC",
    totalSeats: 40,
    amenities: [],
    routeIds: [],
  });

  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  /* ======================================================
     FETCH ROUTES
     ====================================================== */
  const fetchRoutes = async () => {
    setRoutesLoading(true);
    try {
      const res = await axios.get("/api/route"); // ✅ correct endpoint

      if (res.data?.success && Array.isArray(res.data.routes)) {
        setRoutes(res.data.routes);
      } else {
        toast.error("Invalid routes response");
        setRoutes([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch routes. Is backend running?");
      setRoutes([]);
    } finally {
      setRoutesLoading(false);
    }
  };

  /* ======================================================
     PREFILL FORM (EDIT MODE)
     ====================================================== */
  useEffect(() => {
    fetchRoutes();

    if (busToEdit) {
      setFormData({
        busNumber: busToEdit.busNumber || "",
        operatorName: busToEdit.operatorName || "",
        busType: busToEdit.busType || "AC",
        totalSeats: busToEdit.totalSeats || 40,
        amenities: busToEdit.amenities || [],
        routeIds: busToEdit.routes?.map((r) => r._id || r) || [],
      });
    }
  }, [busToEdit]);

  /* ======================================================
     SUBMIT
     ====================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.busNumber.trim() || !formData.operatorName.trim()) {
      toast.error("Bus Number and Operator Name are required");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("busNumber", formData.busNumber.trim());
      payload.append("operatorName", formData.operatorName.trim());
      payload.append("busType", formData.busType);
      payload.append("totalSeats", formData.totalSeats);
      payload.append("amenities", JSON.stringify(formData.amenities));
      payload.append("routeIds", JSON.stringify(formData.routeIds));

      images.forEach((file) => payload.append("images", file));

      if (busToEdit) {
        await axios.put(`/api/admin/update-bus/${busToEdit._id}`, payload);
        toast.success("Bus updated successfully");
      } else {
        await axios.post("/api/admin/add-bus", payload);
        toast.success("Bus added successfully");
      }

      onSuccess?.();
      setImages([]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save bus");
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     UI
     ====================================================== */
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          placeholder="Bus Number"
          value={formData.busNumber}
          onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
          className="input"
          required
        />

        <input
          placeholder="Operator Name"
          value={formData.operatorName}
          onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
          className="input"
          required
        />

        <select
          value={formData.busType}
          onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
          className="input"
        >
          <option>AC</option>
          <option>Non-AC</option>
          <option>Sleeper</option>
          <option>Semi-Sleeper</option>
        </select>

        <input
          type="number"
          min={10}
          max={60}
          value={formData.totalSeats}
          onChange={(e) => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
          className="input"
        />
      </div>

      {/* ROUTES */}
      <div>
        <label className="font-semibold block mb-2">Assign Routes</label>
        {routesLoading ? (
          <p className="italic text-gray-500">Loading routes...</p>
        ) : routes.length === 0 ? (
          <p className="italic text-gray-500">No routes available</p>
        ) : (
          <select
            multiple
            size={6}
            value={formData.routeIds}
            onChange={(e) =>
              setFormData({
                ...formData,
                routeIds: Array.from(e.target.selectedOptions, (o) => o.value),
              })
            }
            className="input"
          >
            {routes.map((route) => (
              <option key={route._id} value={route._id}>
                {route.source} → {route.destination}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* AMENITIES */}
      <input
        placeholder="Amenities (comma separated)"
        value={formData.amenities.join(", ")}
        onChange={(e) =>
          setFormData({
            ...formData,
            amenities: e.target.value.split(",").map((a) => a.trim()).filter(Boolean),
          })
        }
        className="input"
      />

      {/* IMAGES */}
      <input type="file" multiple accept="image/*" onChange={(e) => setImages([...e.target.files])} />

      {/* SUBMIT */}
      <button disabled={loading} className="btn-primary">
        {loading ? "Saving..." : busToEdit ? "Update Bus" : "Add Bus"}
      </button>
    </form>
  );
};

export default BusForm;
