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
        veryLightNavy: "#f1f3f5",
        lightNavy: "#424a5c",
        mediumNavy: "#2c3a4a",
        navy: "#26303c",
        brightNavy: "#2c3a4a",
        brightBlue: "#3b82f6",
        lightNavy: "#424a5c",
        darkNavy: "#181b22",
        lighterDarkNavy: "#1e222b",
        blackRgba: "rgba(0, 0, 0, 0.9)",
        greenRgba: "rgba(0, 255, 0, 0.3)",
        greenRgba2: "rgba(0, 255, 0, 0.1)",
        redRgba: "rgba(255, 0, 0, 0.5)",
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
