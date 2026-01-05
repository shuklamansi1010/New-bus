import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RouteForm = ({ routeToEdit, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    stops: [],
    distance: 0,
    time: "",
  });
  const [loading, setLoading] = useState(false);

  // Pre-fill if editing
  useEffect(() => {
    if (routeToEdit) {
      setFormData({
        source: routeToEdit.source || "",
        destination: routeToEdit.destination || "",
        stops: routeToEdit.stops || [],
        distance: routeToEdit.distance || 0,
        time: routeToEdit.time || "",
      });
    }
  }, [routeToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.source.trim() || !formData.destination.trim()) {
      toast.error("Source and Destination are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        stops: formData.stops.filter(Boolean),
      };

      if (routeToEdit) {
        await axios.put(`/api/route/${routeToEdit._id}`, payload);
        toast.success("Route updated successfully!");
      } else {
        await axios.post("/api/route/routes", payload);
        toast.success("Route added successfully!");
      }

      onSuccess?.();
      setFormData({ source: "", destination: "", stops: [], distance: 0, time: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg shadow-md bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Source *</label>
          <input
            type="text"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="City A"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Destination *</label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder="City B"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Stops (comma-separated)</label>
          <input
            type="text"
            value={formData.stops.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                stops: e.target.value.split(",").map((s) => s.trim()),
              })
            }
            placeholder="Stop1, Stop2, Stop3"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Distance (km)</label>
          <input
            type="number"
            min="0"
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: Number(e.target.value) })}
            placeholder="0"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Estimated Time</label>
          <input
            type="text"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            placeholder="e.g. 3h 30m"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:bg-gray-400"
        >
          {loading ? "Saving..." : routeToEdit ? "Update Route" : "Add Route"}
        </button>
      </div>
    </form>
  );
};

export default RouteForm;
