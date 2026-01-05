import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react' // Add this if you're using React (most likely)

export default defineConfig({
  plugins: [
    react(),          // Add this line if your project is React (Vite + React is very common)
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Change this to your actual backend port
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Uncomment if your backend routes don't have /api prefix
      },
    },
  },
})