/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#001C3D",
        card: "#0B2C52",
        cardAlt: "#0F335C",
        ink: "#FFFFFF",
        muted: "#9FB3CC",
        border: "#1E3A5F",
        primary: {
          DEFAULT: "#EBAF1C",
          dark: "#C4900F",
          light: "#F4C956",
          ink: "#001C3D",
        },
        danger: "#F87171",
        warn: "#EBAF1C",
        ok: {
          bg: "rgba(34,197,94,0.16)",
          text: "#4ADE80",
        },
        bad: {
          bg: "rgba(248,113,113,0.16)",
          text: "#F87171",
        },
        pending: {
          bg: "rgba(235,175,28,0.18)",
          text: "#EBAF1C",
        },
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};
