import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AdminContextProvider from "./context/AdminContext.jsx";
import AppContextProvider from "./context/AppContext.jsx";
import axios from "axios";

// ------------------------------
// Automatically attach admin token to axios
// ------------------------------
axios.interceptors.request.use(
  (config) => {
    const aToken = localStorage.getItem("aToken");

    if (config.url.includes("/api/admin") && aToken) {
      config.headers.Authorization = `Bearer ${aToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ------------------------------
// Render App
// ------------------------------
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);
