/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        custom: {
          100: "#f3f3f3",
          200: "#ebebeb",
          300: "rgba(51,51,51,0.85)",
        },
      },
      maxWidth: {
        1400: "1400px",
      },
    },
    plugins: [],
  },
};
