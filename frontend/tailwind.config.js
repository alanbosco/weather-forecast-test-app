/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,vue,ts}"],
  theme: {
    extend: {
      colors: {
        'primary': {
          '100': '#c6d6f5', 
          '200': '#a3b6ed',
          '300': '#7f97e5',
          '400': '#4d6bdc',
          '500': '#1a4ddd',
        }
      }
    },
  },
  plugins: [],
}

