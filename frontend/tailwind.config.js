/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-share-tech)', 'sans-serif'],
      },
      colors: {
        bg: '#0A0E1A',
        surface: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.1)',
        accent: '#39FF88',
        'accent-2': '#22D3EE',
        'text-primary': '#F5F7FA',
        'text-muted': '#94A3B8',
        positive: '#39FF88',
        negative: '#FF5C7A',
      },
    },
  },
  plugins: [],
};
