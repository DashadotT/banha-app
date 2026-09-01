/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#f1f5f9",
        card: "#ffffff",
        ink: "#1e293b",
        muted: "#64748b",
        border: "#e2e8f0",
        primary: {
          DEFAULT: "#15803d",
          dark: "#0f5c2c",
          light: "#22c55e",
        },
        danger: "#dc2626",
        warn: "#d97706",
        ok: {
          bg: "#dcfce7",
          text: "#15803d",
        },
        bad: {
          bg: "#fee2e2",
          text: "#dc2626",
        },
        pending: {
          bg: "#fef3c7",
          text: "#b45309",
        },
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};