/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1A1917",
          soft: "#3A3835",
        },
        sand: {
          DEFAULT: "#FAF8F5",
          100: "#F5F1EA",
          200: "#EDE7DD",
        },
        clay: {
          DEFAULT: "#C1622D",
          50: "#FBEEE6",
          100: "#F6DBC7",
          500: "#C1622D",
          600: "#A64F21",
          700: "#8A4119",
        },
        muted: "#8A8580",
        line: "#E7E2D9",
        danger: "#C1432D",
      },
      fontFamily: {
        display: ["System"],
      },
      borderRadius: {
        xl2: "20px",
      },
    },
  },
  plugins: [],
};
