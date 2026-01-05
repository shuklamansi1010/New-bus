/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom grid for auto-filling cards
      gridTemplateColumns: {
        auto: "repeat(auto-fill, minmax(200px, 1fr))",
      },
      // Primary color set to green
      colors: {
        primary: "#008000", // Deep Green (you can change this shade)
        // Optional: Add variations for better design
        "primary-dark": "#006400",
        "primary-light": "#90EE90",
      },
    },
  },
  plugins: [],
};