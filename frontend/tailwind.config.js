/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060B18',
          900: '#0B132B',
          850: '#0F1A3A',
          800: '#1C2541',
          700: '#3A506B',
        },
        brand: {
          cyan: '#48CAE4',
          teal: '#00B4D8',
          blue: '#0077B6',
          indigo: '#6366F1',
          purple: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
