/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-montserrat)', 'sans-serif'],
        sans: ['var(--font-open-sans)', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#087C7C',
          dark: '#066666',
          light: '#0AA0A0',
        },
        background: '#f2f7ff',
      },
    },
  },
  plugins: [],
}
