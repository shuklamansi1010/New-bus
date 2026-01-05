import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { AppContext } from "../context/AppContext";
import NotificationCard from "../components/NotificationCard";

const PRIMARY_COLOR = "#00A36C";
const HOVER_COLOR = "#008557";

const AMENITY_OPTIONS = [
  "WiFi",
  "AC",
  "Charging Port",
  "Water Bottle",
  "Blanket",
  "TV",
  "Reading Light",
  "Emergency Exit",
  "Fire Extinguisher",
  "CCTV",
  "GPS Tracking",
  "Snacks",
];

const BUS_TYPES = ["Seater", "Sleeper", "Semi-Sleeper"];

const AddBus = () => {
  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  const [busImg, setBusImg] = useState(null);
  const [busImgName, setBusImgName] = useState("");
  const [busName, setBusName] = useState("");
  const [routeId, setRouteId] = useState("");
  const [busType, setBusType] = useState("Seater");
  const [seaterPrice, setSeaterPrice] = useState("");
  const [sleeperPrice, setSleeperPrice] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [duration, setDuration] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [routesList, setRoutesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({
    type: "",
    message: "",
    title: "",
    show: false,
  });

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/routes`, {
          headers: { aToken },
        });
        if (data.success) setRoutesList(data.routes);
      } catch {
        showNotification("error", "Failed to load routes.");
      }
    };
    if (aToken) fetchRoutes();
  }, [aToken, backendUrl]);

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setBusImg(file);
      setBusImgName(file.name);
    } else {
      setBusImg(null);
      setBusImgName("");
      showNotification("warning", "Please select a valid image.");
    }
  };

  const showNotification = (type, message) => {
    setNotification({
      type,
      message,
      title:
        type === "success"
          ? "Success!"
          : type === "error"
          ? "Error!"
          : "Warning!",
      show: true,
    });
  };

  const resetForm = () => {
    setBusImg(null);
    setBusImgName("");
    setBusName("");
    setRouteId("");
    setBusType("Seater");
    setSeaterPrice("");
    setSleeperPrice("");
    setDepartureTime("");
    setArrivalTime("");
    setDuration("");
    setAmenities([]);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (
      !busImg ||
      !busName ||
      !routeId ||
      !seaterPrice ||
      !sleeperPrice ||
      !departureTime ||
      !arrivalTime ||
      !duration
    ) {
      return showNotification("warning", "Please fill all required fields.");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", busImg);
      formData.append("busName", busName.trim());
      formData.append("busType", busType);
      formData.append("routeId", routeId);
      formData.append("amenities", JSON.stringify(amenities));
      formData.append("seaterPrice", seaterPrice);
      formData.append("sleeperPrice", sleeperPrice);
      formData.append("departureTime", departureTime);
      formData.append("arrivalTime", arrivalTime);
      formData.append("duration", duration);

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-bus`,
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        showNotification("success", data.message);
        resetForm();
      } else {
        showNotification("error", data.message);
      }
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {notification.show && (
        <NotificationCard
          {...notification}
          onClose={() =>
            setNotification({ ...notification, show: false })
          }
        />
      )}

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🚌 Add New Bus</h1>

        <form
          onSubmit={onSubmitHandler}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          {/* Bus Name & Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={busName}
              onChange={(e) => setBusName(e.target.value)}
              placeholder="Bus Name"
              className="input"
            />
            <select
              value={busType}
              onChange={(e) => setBusType(e.target.value)}
              className="input"
            >
              {BUS_TYPES.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Route */}
          <select
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            className="input"
          >
            <option value="">Select Route</option>
            {routesList.map((r) => (
              <option key={r._id} value={r._id}>
                {r.source} → {r.destination}
              </option>
            ))}
          </select>

          {/* Times */}
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="input"
            />
            <input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="input"
            />
            <input
              placeholder="Duration (e.g. 8h 30m)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input"
            />
          </div>

          {/* Prices */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Seater Price"
              value={seaterPrice}
              onChange={(e) => setSeaterPrice(e.target.value)}
              className="input"
            />
            <input
              type="number"
              placeholder="Sleeper Price"
              value={sleeperPrice}
              onChange={(e) => setSleeperPrice(e.target.value)}
              className="input"
            />
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-semibold mb-2">Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {AMENITY_OPTIONS.map((amenity) => (
                <label
                  key={amenity}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition
                    ${
                      amenities.includes(amenity)
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-white border-gray-300 hover:border-green-400"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="accent-green-600"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* Submit */}
          <button
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Adding..." : "Add Bus"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddBus;
