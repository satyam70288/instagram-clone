/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: { 
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        gradientBorder: {
          '0%': {
            'border-image-source': 'linear-gradient(to right, #F58529, #DD2A7B, #8134AF)',
          },
          '50%': {
            'border-image-source': 'linear-gradient(to left, #F58529, #DD2A7B, #8134AF)',
          },
          '100%': {
            'border-image-source': 'linear-gradient(to right, #F58529, #DD2A7B, #8134AF)',
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        gradientBorder: 'gradientBorder 5s linear infinite',
      },
      borderImage: {
        gradient: 'linear-gradient(to right, #F58529, #DD2A7B, #8134AF)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
