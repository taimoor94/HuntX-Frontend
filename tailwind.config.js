/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Indigo for buttons and highlights
        secondary: "#9333EA", // Purple for accents
        bgDark: "#1F2937", // Dark gray for backgrounds
      },
    },
  },
  plugins: [],
};