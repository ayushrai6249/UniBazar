/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#113F67",
        'secondary': "#34699A",
        'tertiary': "#58A0C8"
      },
      keyframes: {
        fadeIn: {
          'from': { 
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out'
      }
    },
  },
  plugins: [],
}

