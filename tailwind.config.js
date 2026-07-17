/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C1440E",
        secondary: "#E8A33D",
        charcoal: "#1E1B18",
        offwhite: "#F7F4F0",
        neutraltext: "#4A4340",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        wave: "wave 1s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.2)" },
          "50%": { transform: "scaleY(1.2)" },
        },
      },
    },
  },
  plugins: [],
}
