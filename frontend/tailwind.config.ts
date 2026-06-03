import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bou: {
          50: "#FAF7F2",
          100: "#F2EAE0",
          200: "#E4D4C3",
          300: "#D2BFA6",
          400: "#BBA081",
          500: "#4A2C1B",
          600: "#3D2416",
          700: "#301D11",
          800: "#24150D",
          900: "#170E08",
          gold: "#C5A880",
          "gold-light": "#D8C4A9",
          accent: "#8C6239",
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
