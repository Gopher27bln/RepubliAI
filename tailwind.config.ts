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
        navy: {
          50: "#f0f4ff",
          100: "#dce6ff",
          200: "#b8ccff",
          300: "#86a8ff",
          400: "#527aff",
          500: "#2a4dff",
          600: "#1230f5",
          700: "#0d1ee1",
          800: "#1118b6",
          900: "#131a8f",
          950: "#0c1057",
        },
        brand: {
          DEFAULT: "#1230f5",
          dark: "#0c1057",
          accent: "#6366f1",
          light: "#dce6ff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
