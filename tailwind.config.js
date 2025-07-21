/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff',
          dark: '#000000',
        },
        text: {
          light: '#000000',
          dark: '#ffffff',
        },
      },
    },
  },

  plugins: [],
};
