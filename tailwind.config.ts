import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TNT Brand Colors
        brand: {
          darkBlue: "#14384E",      // Primary Base - use as bg-brand-darkBlue
          brandBlue: "#1d4c93",      // Secondary Base - use as bg-brand-brandBlue
          lightBlue: "#89cde7",      // Support - use as bg-brand-lightBlue
          lightGrey: "#f4f4f4",     // Neutral Backgrounds - use as bg-brand-lightGrey
          accentRed: "#e21729",      // Accent - use as bg-brand-accentRed
        },
        // Legacy support - map primary to brand colors
        primary: {
          DEFAULT: "#e21729",           // Accent Red for primary actions
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#e21729",               // Accent Red
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      fontFamily: {
        sans: ["Lato", "sans-serif"],           // Primary UI font
        heading: ["Roboto", "sans-serif"],       // Headers, metrics, KPIs
        display: ["Bebas Neue", "sans-serif"],   // Large numeric KPIs
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle, #1d4c93 0%, #14384E 100%)",
      },
    },
  },
  plugins: [],
};
export default config;


