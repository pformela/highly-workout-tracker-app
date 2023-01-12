module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {
        silver: "#e7e6ea",
        gray: "#a09fa7",
        darkGray: "#5d6771",
        navy: "#26303c",
        lightNavy: "#424a5c",
        darkNavy: "#181b22",
        blackRgba: "rgba(0, 0, 0, 0.9)",
      },
    },
  },
  variants: {
    extend: {
      colors: {
        silver: "#e7e6ea",
        gray: "#a09fa7",
        darkGray: "#5d6771",
        navy: "#26303c",
        darkNavy: "#181b22",
      },
    },
  },
  plugins: [],
};
