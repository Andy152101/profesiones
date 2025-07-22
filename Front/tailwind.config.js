/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ester: 'rgb(57, 169, 0)', // Definimos el color personalizado
        blueSena:'rgb(0,49,77)',
        claroSena:'rgb(130,222,240)',
        greenSena :'rgb(56,91,86)',
        yellowSena :'rgb(255,206,64)',
      },
    },
  },
  plugins: [],
}
