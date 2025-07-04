/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'myanmar': ['Noto Sans Myanmar', 'Myanmar Text', 'Padauk', 'Pyidaungsu', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
      colors: {
        'gkk-yellow': {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      }
    },
  },
  plugins: [],
}