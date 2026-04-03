/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#d4af37', hover: '#c49b2e', light: '#e8d06a' },
        dark: { DEFAULT: '#1a1a1a', surface: '#242424', border: '#333333' },
        cream: '#F2EDE4',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
