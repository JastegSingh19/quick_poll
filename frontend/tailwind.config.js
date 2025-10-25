/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7C3AED", // violet-600
          light: "#C084FC",   // fuchsia-300-ish
          dark: "#6D28D9"
        },
        accent: {
          DEFAULT: "#DB2777", // pink-600
          light: "#F472B6",
          dark: "#BE185D"
        }
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)"
      }
    },
  },
  plugins: [],
}
