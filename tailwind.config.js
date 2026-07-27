/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./js/**/*.js", "./css/**/*.css"],
  theme: {
    extend: {
      colors: {
        surface: "#051424",
        "surface-dim": "#051424",
        "surface-bright": "#2c3a4c",
        "surface-container": "#122131",
        "surface-container-low": "#0d1c2d",
        "surface-container-lowest": "#010f1f",
        "surface-container-high": "#1c2b3c",
        "surface-container-highest": "#273647",
        "surface-variant": "#273647",
        "surface-tint": "#b7c4ff",
        background: "#051424",
        primary: "#b7c4ff",
        "primary-container": "#0052ff",
        "on-primary": "#002682",
        "on-primary-container": "#dfe3ff",
        "on-surface": "#d4e4fa",
        "on-surface-variant": "#c3c5d9",
        "on-background": "#d4e4fa",
        "inverse-surface": "#d4e4fa",
        secondary: "#bec6e0",
        outline: "#8d90a2",
        "outline-variant": "#434656",
        error: "#ffb4ab",
      },
      spacing: {
        "container-max": "1280px",
        gutter: "24px",
        "margin-tablet": "32px",
        "margin-desktop": "64px",
        "margin-mobile": "20px",
      },
      fontFamily: {
        "body-lg": ["Inter"],
        "headline-md-mobile": ["Geist", "sans-serif"],
        "headline-md": ["Geist", "sans-serif"],
        "display-lg-mobile": ["Geist", "sans-serif"],
        "display-lg": ["Geist", "sans-serif"],
        "body-md": ["Inter"],
        "label-sm": ["JetBrains Mono"],
      },
      fontSize: {
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-md-mobile": [
          "24px",
          {
            lineHeight: "32px",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        "headline-md": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        "display-lg-mobile": [
          "40px",
          {
            lineHeight: "48px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "display-lg": [
          "64px",
          {
            lineHeight: "72px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-sm": [
          "13px",
          {
            lineHeight: "16px",
            letterSpacing: "0.05em",
            fontWeight: "500",
          },
        ],
      },
    },
  },
  plugins: [],
};
