/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        obsidian: {
          950: '#050507',
          900: '#0B0C0E',
          850: '#141518',
          800: '#181A1E',
          750: '#202227',
          700: '#2B2E36',
        },
        mint: {
          300: '#6FFAE0',
          400: '#2DF5C6',
          500: '#1FDCA8',
        },
        cyanbolt: {
          300: '#6FE6FF',
          400: '#19C8FF',
          500: '#1598E5',
        },
        iris: {
          400: '#9A7FFF',
          500: '#7C5CFF',
        },
      },
    },
  },
  plugins: [],
};
