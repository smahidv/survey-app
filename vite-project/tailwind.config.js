/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-out-left': {
          "from": {
            right: '-100%',
            opacity: '0'
          },
          "to": {
            right: '2%',
            opacity: '1'
          },
        },
      },
      animation: {
        'fade-out-left': "fade-out-left .5s ease-in-out both",
      },
    },
  },
  plugins: [],
}

