import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        somang: {
          bark: "#5a3f2b",
          leaf: "#9bc59d",
          sky: "#d8e8f2",
          cream: "#fdf7ec",
          sun: "#f3c969",
          rose: "#f4b8c0",
          ink: "#3c2e21",
          stone: "#8a7867",
          mist: "#e8dfd1",
        },
        postit: {
          yellow: "#fff4a3",
          "yellow-edge": "#e8d971",
          blue: "#bcd9f5",
          "blue-edge": "#7aaadc",
          green: "#bfe5b8",
          "green-edge": "#74b46c",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      animation: {
        "float-soft": "float-soft 4s ease-in-out infinite",
        sway: "sway 6s ease-in-out infinite",
        "drop-in": "drop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        "float-soft": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        sway: {
          "0%,100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        "drop-in": {
          "0%": { transform: "translateY(-30px) rotate(-8deg)", opacity: "0" },
          "100%": { transform: "translateY(0) rotate(-2deg)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
