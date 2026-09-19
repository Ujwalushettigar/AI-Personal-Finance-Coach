/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111318",
        surface: "#F4F5F1",
        accent: "#D6FF3F",
        "accent-dark": "#A8CC1F",
        muted: "#6B7280",
        lime: {
          500: "#84cc16",
          600: "#65a30d",
        },
      },
    },
  },
  plugins: [],
};
