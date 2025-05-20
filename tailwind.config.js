/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // pour le dossier app/
    "./pages/**/*.{js,ts,jsx,tsx}", // si jamais tu as encore des pages legacy
    "./components/**/*.{js,ts,jsx,tsx}", // si tu as un dossier components/
    "./src/**/*.{js,ts,jsx,tsx}", // tout le src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
