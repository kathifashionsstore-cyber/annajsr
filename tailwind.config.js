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
        
        // Editorial Theme Colors
        "edi-black": "#111111",
        "edi-heading": "#181818",
        "edi-body": "#5F5F5F",
        "edi-muted": "#898989",
        "edi-white": "#FFFFFF",
        "edi-cream": "#F4EFE7",
        "edi-warm-light": "#F8F6F1",
        "edi-beige": "#D8CBBB",
        "edi-accent": "#A98760",
        "edi-accent-dark": "#806346",
        "edi-border": "#DDD7CE",
        "edi-footer": "#111111",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Manrope'", "system-ui", "sans-serif"],
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
