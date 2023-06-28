/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-light": "#ffffff",
        "secondary-light": "#8D9B6A",
        "primary-dark": "#75654C",
        "secondary-dark": "#8A9EA7",
      },
      backgroundImage: {
        "main-bg":
          "linear-gradient(to bottom, #ded1bd, #e6daca, #ede3d7, #f4ece5, #faf6f2)",
      },
      boxShadow: {
        small:
          "rgba(117, 101, 76, 0.12) 0px 1px 3px, rgba(117, 101, 76, 0.24) 0px 1px 2px",
        medium:
          "rgba(117, 101, 76, 0.16) 0px 3px 6px, rgba(117, 101, 76, 0.23) 0px 3px 6px",
        large:
          "rgba(117, 101, 76, 0.25) 0px 13px 27px -5px, rgba(117, 101, 76, 0.3) 0px 8px 16px -8px",
      },
    },
  },
  plugins: [],
};
