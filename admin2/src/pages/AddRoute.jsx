import React, { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { AppContext } from "../context/AppContext";
import NotificationCard from "../components/NotificationCard";
import { FaMapMarkerAlt, FaRoad, FaClock, FaPlusCircle } from "react-icons/fa"; // Import icons for visual enhancement

// Define the primary Green color palette
const PRIMARY_GREEN = "#1AA260"; // Vibrant Green
const HOVER_GREEN = "#157A4A";  // Darker green for hover

const AddRoute = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [stops, setStops] = useState(""); // comma-separated input
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({
    type: "",
    message: "",
    title: "",
    show: false,
  });

  const { addRoute } = useContext(AdminContext);

  const showNotification = (type, message, title = "") => {
    const titles = {
      success: "Success!",
      error: "Error!",
      warning: "Warning!",
    };
    setNotification({
      type,
      message,
      title: title || titles[type],
      show: true,
    });
  };

  const resetForm = () => {
    setSource("");
    setDestination("");
    setStops("");
    setDistance("");
    setTime("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const trimmedSource = source.trim();
    const trimmedDestination = destination.trim();

    if (!trimmedSource || !trimmedDestination) {
      return showNotification("warning", "Source and Destination are required.");
    }

    if (trimmedSource.toLowerCase() === trimmedDestination.toLowerCase()) {
      return showNotification("warning", "Source and Destination cannot be the same.");
    }

    setLoading(true);

    try {
      const routeData = {
        source: trimmedSource,
        destination: trimmedDestination,
        stops: stops
          ? stops
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s !== "")
          : [],
        distance: distance ? Number(distance) : undefined,
        time: time.trim() || undefined,
      };

      const success = await addRoute(routeData);

      if (success) {
        showNotification("success", "Route added successfully!");
        resetForm();
      }
    } catch (err) {
      console.error("Add Route Error:", err);
      showNotification("error", "Failed to add route. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper component for styled input fields
  const InputField = ({ label, value, onChange, placeholder, required = false, type = "text", info = null, Icon }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        {Icon && <Icon className="text-lg" style={{ color: PRIMARY_GREEN }} />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={type === "number" ? "1" : undefined}
        style={{ focusRingColor: PRIMARY_GREEN }}
        className={`w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_GREEN}] focus:border-transparent transition duration-200`}
        required={required}
      />
      {info && <p className="text-xs text-gray-500 mt-2">{info}</p>}
    </div>
  );

  return (
    <>
      {notification.show && (
        <NotificationCard
          type={notification.type}
          message={notification.message}
          title={notification.title}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3 border-b pb-2">
          <FaRoad style={{ color: PRIMARY_GREEN }} /> Add New Route
        </h1>

        <form
          onSubmit={onSubmitHandler}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100"
        >
          <div className="p-8 space-y-8">
            
            {/* 1. Key Route Info (Source & Destination) */}
            <fieldset className="p-6 border border-gray-200 rounded-xl shadow-inner bg-gray-50">
                <legend className="text-xl font-bold text-gray-700 px-2 flex items-center gap-2">
                    <FaMapMarkerAlt style={{ color: PRIMARY_GREEN }} /> Origin & Destination
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <InputField
                        label="Source City"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="e.g., Mumbai"
                        required
                        Icon={FaMapMarkerAlt}
                    />

                    <InputField
                        label="Destination City"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g., Delhi"
                        required
                        Icon={FaMapMarkerAlt}
                    />
                </div>
            </fieldset>

            {/* 2. Intermediate Stops */}
            <fieldset className="p-6 border border-gray-200 rounded-xl">
                <legend className="text-xl font-bold text-gray-700 px-2 flex items-center gap-2">
                    <FaPlusCircle style={{ color: PRIMARY_GREEN }} /> Intermediate Stops
                </legend>
                <div className="pt-4">
                    <InputField
                        label="Cities to stop at (Optional)"
                        value={stops}
                        onChange={(e) => setStops(e.target.value)}
                        placeholder="e.g., Pune, Ahmedabad, Jaipur"
                        info="Separate multiple stops with commas (e.g., CityA, CityB)"
                    />
                </div>
            </fieldset>

            {/* 3. Operational Details (Distance & Time) */}
            <fieldset className="p-6 border border-gray-200 rounded-xl shadow-inner bg-gray-50">
                <legend className="text-xl font-bold text-gray-700 px-2 flex items-center gap-2">
                    <FaClock style={{ color: PRIMARY_GREEN }} /> Travel Logistics
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <InputField
                        label="Distance (km)"
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="e.g., 1400"
                        Icon={FaRoad}
                        info="Required for accurate fare calculation."
                    />

                    <InputField
                        label="Estimated Travel Time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="e.g., 18h 30m"
                        Icon={FaClock}
                        info="e.g., 18 hours or 18h 30m."
                    />
                </div>
            </fieldset>


            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: PRIMARY_GREEN, hoverBgColor: HOVER_GREEN }}
                className={`px-12 py-4 text-lg font-bold text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {loading ? "Processing..." : "Create New Route"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddRoute;