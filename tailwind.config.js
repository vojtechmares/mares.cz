module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        test: "#f59e0b",
        tulip: "#ffac00",
        lava: "#f56e0f",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
